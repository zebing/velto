#!/usr/bin/env node
import { execSync } from 'child_process';
import enquirer from 'enquirer';
import fs from 'fs';

const { prompt } = enquirer;
const pwd = process.cwd();
const REGISTRY = 'https://registry.npmjs.org/';
const getVersionPath = `${pwd}/packages/babel-plugin-velto/package.json`;

class Publisher {
  async execute(command, errorMsg, options = {}) {
    try {
      return await execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {
      console.error(`❌ ${errorMsg || 'Execution failed'}:`, error.message);
      process.exit(1);
    }
  }

  async checkAuth() {
    console.log('\nChecking login status...');

    const user = await this.execute(
      `npm whoami --registry ${REGISTRY}`,
      '⚠️ Please execute "npm login" first to log in to NPM',
      {
        stdio: 'pipe',
        encoding: 'utf-8',
      }
    );
    console.log(`\n👤 Current logged in user: ${user}`);
  }

  async generateChangeset() {
    console.log('\ngenerate changeset...');
    await this.execute('pnpm changeset', 'Failed to generate a change set!');
    await this.execute(
      'pnpm changeset version',
      'Application change version failed!'
    );
  }

  async updateLockfile() {
    console.log('\nUpdate pnpm-lock.yaml file...');
    await this.execute('pnpm install --no-frozen-lockfile', 'Update pnpm-lock.yaml file failed!');
  }

  async buildPackages() {
    console.log('\nBuild packages...');
    await this.execute('pnpm run build', 'Build packages failed');
  }

  async publish(version) {
    const { yes } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Releasing v${version}. Confirm?`,
    });

    if (!yes) {
      throw new Error('Publish cancelled');
    }
    console.log('\nPublish packages...');

    // await this.execute(
    //   `pnpm publish --tag beta`,
    //   `Publish packages failed!`,
    // );
  }

  async commitChanges(version) {
    console.log('\ngit code...');
    await this.execute('git add .', 'git add failed');
    await this.execute('git commit -m "chore: publish packages"', 'git commit failed');
    await this.execute(`git tag v${version}`, 'git tag failed');
    // await this.execute('git push --follow-tags', 'git push failed');
  }

  async getVersion(){
    try {
      const data = JSON.parse(fs.readFileSync(getVersionPath, 'utf8'));
      if (!data?.version) {
        throw new Error(`Version not found in ${getVersionPath}`);
      }

      return data.version;
    } catch (error) {
      console.error('Get failed!', error);
      process.exit(1);
    }
  }

  async updateRootPackageJson(version) {
    console.log('\nUpdate root package.json...');
    try {
      const packageJsonPath = `${pwd}/package.json`;
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      fs.writeFileSync(packageJsonPath, JSON.stringify({
        ...(packageJson || {}),
        version,
      }, null, 2));

    } catch (error) {
      console.error('Update root package.json failed!', error);
      process.exit(1);
    }
    
    
  }

  async run() {
    await this.checkAuth();
    await this.generateChangeset();
    const version = await this.getVersion();
    await this.updateRootPackageJson(version);
    // await this.updateLockfile();
    // await this.buildPackages();
    // await this.publish(version);
    // await this.commitChanges(version);
    
    
  }
}

new Publisher().run().catch(console.error);