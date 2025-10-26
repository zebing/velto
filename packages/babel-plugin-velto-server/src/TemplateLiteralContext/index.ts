import { VariableDeclaration, Expression, stringLiteral, StringLiteral, templateLiteral, templateElement, isStringLiteral, TemplateElement, ExpressionStatement } from "@babel/types";

export default class TemplateLiteralContext {
	private materielList: Expression[] = [];
	public hoistExpressions: VariableDeclaration[] = [];

	constructor(
		public rootContext?: TemplateLiteralContext,
	) {}

	public pushHoistExpressions(expression: VariableDeclaration) {
		if (this.rootContext) {
			this.rootContext.hoistExpressions.push(expression);
			return;
		}
		this.hoistExpressions.push(expression);
	}

	public pushStringLiteral(stringLiteral: StringLiteral) {
		this.materielList.push(stringLiteral);
	}

	public pushExpression(expression: Expression) {
		this.materielList.push(expression);
	}

	public generateTemplateLiteral() {
		const quasis: TemplateElement[] = [];
		const expressions: Expression[] = [];
		let str = '';

		this.materielList.forEach(materiel => {
			if (isStringLiteral(materiel)) {
				str += materiel.value;
			} else {
				quasis.push(templateElement({ raw: str, cooked: str }, false));
				expressions.push(materiel);
				str = '';
			}
		});

		quasis.push(templateElement({ raw: str, cooked: str }, true));

		return templateLiteral(quasis, expressions);
	}
}
