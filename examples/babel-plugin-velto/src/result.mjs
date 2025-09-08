import { element as _element2, text as _text2, markRender as _markRender, component as _component2, renderList as _renderList, expression as _expression, condition as _condition2 } from "@velto/runtime";
import { ref } from "@velto/runtime";
import styles from "./styles.module.scss";
let i = 0;
export default function List() {
  let state = ref(true);
  const list = ref([{
    id: i++,
    name: '小张',
    grade: '一年级',
    age: 8
  }, {
    id: i++,
    name: '小王',
    grade: '二年级',
    age: 9
  }, {
    id: i++,
    name: '小李',
    grade: '一年级',
    age: 8
  }]);
  const unshift = () => {
    // list[0].name = 'name'
    for (let j = 0; j < 10; j++) {
      list.unshift({
        id: i++,
        name: '小丽 unshift',
        grade: '一年级',
        age: 8
      });
    }
  };
  const append = () => {
    list.push({
      id: i++,
      name: '小丽 append',
      grade: '一年级',
      age: 8
    });
  };
  const insert = () => {
    list.splice(2, 0, {
      id: i++,
      name: '小丽 insert',
      grade: '一年级',
      age: 8
    });
  };
  const deletefrom10 = () => {
    list.splice(10, 1);
  };
  return _markRender(() => {
    const _element = _element2("div", {
      class: styles.wrap,
      onClick: i > 6 ? deletefrom10 : undefined
    });
    const _component = _component2(Test, {
      children: _markRender(() => {
        const _element3 = _element2("div", {});
        const _text = _text2("test children");
        return {
          hydrade() {
            return [{
              node: _element3,
              type: 2,
              tag: "div",
              children: [{
                node: _text,
                type: 3,
                children: []
              }]
            }];
          },
          mount(target, anchor) {
            _element3.mount(target, anchor);
            _text.mount(_element3.el);
          },
          update() {},
          destroy() {
            _element3.destroy();
            _text.destroy();
          }
        };
      })
    });
    const _element4 = _element2("button", {
      disabled: true
    });
    const _text3 = _text2("test");
    const _element5 = _element2("div", {});
    const _text4 = _text2("text");
    const _element6 = _element2("div", {
      class: styles.list
    });
    const _renderList2 = _renderList(list.value, ({
      id
    }, _index, _array) => _markRender(() => {
      const _element0 = _element2("div", {
        class: styles.item
      });
      const _element1 = _element2("div", {});
      const _express4 = _expression(student.id);
      return {
        hydrade() {
          return [{
            node: _element0,
            type: 2,
            tag: "div",
            children: [{
              node: _element1,
              type: 2,
              tag: "div",
              children: [{
                node: _express4,
                type: 4,
                children: []
              }]
            }]
          }];
        },
        mount(target, anchor) {
          _element0.mount(target, anchor);
          _element1.mount(_element0.el);
          _express4.mount(_element1.el);
        },
        update() {
          _element0.update({
            class: styles.item
          });
          _express4.update(student.id);
        },
        destroy() {
          _element0.destroy();
          _element1.destroy();
          _express4.destroy();
        }
      };
    }));
    const _express = _expression(_markRender(() => {
      const _element7 = _element2("div", {});
      const _text5 = _text2("Logical jsx");
      return {
        hydrade() {
          return [{
            node: _element7,
            type: 2,
            tag: "div",
            children: [{
              node: _text5,
              type: 3,
              children: []
            }]
          }];
        },
        mount(target, anchor) {
          _element7.mount(target, anchor);
          _text5.mount(_element7.el);
        },
        update() {},
        destroy() {
          _element7.destroy();
          _text5.destroy();
        }
      };
    }));
    const _condition = _condition2(_express, state);
    const _express2 = _expression(_markRender(() => {
      const _element8 = _element2("div", {});
      const _text6 = _text2("codition1");
      return {
        hydrade() {
          return [{
            node: _element8,
            type: 2,
            tag: "div",
            children: [{
              node: _text6,
              type: 3,
              children: []
            }]
          }];
        },
        mount(target, anchor) {
          _element8.mount(target, anchor);
          _text6.mount(_element8.el);
        },
        update() {},
        destroy() {
          _element8.destroy();
          _text6.destroy();
        }
      };
    }));
    const _condition3 = _condition2(_express2, state);
    const _express3 = _expression(_markRender(() => {
      const _element9 = _element2("div", {});
      const _text7 = _text2("condition2");
      return {
        hydrade() {
          return [{
            node: _element9,
            type: 2,
            tag: "div",
            children: [{
              node: _text7,
              type: 3,
              children: []
            }]
          }];
        },
        mount(target, anchor) {
          _element9.mount(target, anchor);
          _text7.mount(_element9.el);
        },
        update() {},
        destroy() {
          _element9.destroy();
          _text7.destroy();
        }
      };
    }));
    const _condition4 = _condition2(_express3, !state);
    return {
      hydrade() {
        return [{
          node: _element,
          type: 2,
          tag: "div",
          children: [{
            node: _component,
            type: 1,
            children: []
          }, {
            node: _element4,
            type: 2,
            tag: "button",
            children: [{
              node: _text3,
              type: 3,
              children: []
            }]
          }, {
            node: _element5,
            type: 2,
            tag: "div",
            children: [{
              node: _text4,
              type: 3,
              children: []
            }]
          }, {
            node: _element6,
            type: 2,
            tag: "div",
            children: [{
              node: _renderList2,
              type: 5,
              children: []
            }]
          }, {
            node: _condition,
            type: 6,
            children: []
          }, {
            node: _condition3,
            type: 6,
            children: []
          }, {
            node: _condition4,
            type: 6,
            children: []
          }]
        }];
      },
      mount(target, anchor) {
        _element.mount(target, anchor);
        _component.mount(_element.el);
        _element4.mount(_element.el);
        _text3.mount(_element4.el);
        _element5.mount(_element.el);
        _text4.mount(_element5.el);
        _element6.mount(_element.el);
        _renderList2.mount(_element6.el);
        _condition.mount(_element.el);
        _condition3.mount(_element.el);
        _condition4.mount(_element.el);
      },
      update() {
        _element.update({
          class: styles.wrap,
          onClick: i > 6 ? deletefrom10 : undefined
        });
        _element4.update({
          disabled: true
        });
        _element6.update({
          class: styles.list
        });
        _renderList2.update(list.value);
        _condition.update(state, _markRender(() => {
          const _element7 = _element2("div", {});
          const _text5 = _text2("Logical jsx");
          return {
            hydrade() {
              return [{
                node: _element7,
                type: 2,
                tag: "div",
                children: [{
                  node: _text5,
                  type: 3,
                  children: []
                }]
              }];
            },
            mount(target, anchor) {
              _element7.mount(target, anchor);
              _text5.mount(_element7.el);
            },
            update() {},
            destroy() {
              _element7.destroy();
              _text5.destroy();
            }
          };
        }));
        _condition3.update(state, _markRender(() => {
          const _element8 = _element2("div", {});
          const _text6 = _text2("codition1");
          return {
            hydrade() {
              return [{
                node: _element8,
                type: 2,
                tag: "div",
                children: [{
                  node: _text6,
                  type: 3,
                  children: []
                }]
              }];
            },
            mount(target, anchor) {
              _element8.mount(target, anchor);
              _text6.mount(_element8.el);
            },
            update() {},
            destroy() {
              _element8.destroy();
              _text6.destroy();
            }
          };
        }));
        _condition4.update(!state, _markRender(() => {
          const _element9 = _element2("div", {});
          const _text7 = _text2("condition2");
          return {
            hydrade() {
              return [{
                node: _element9,
                type: 2,
                tag: "div",
                children: [{
                  node: _text7,
                  type: 3,
                  children: []
                }]
              }];
            },
            mount(target, anchor) {
              _element9.mount(target, anchor);
              _text7.mount(_element9.el);
            },
            update() {},
            destroy() {
              _element9.destroy();
              _text7.destroy();
            }
          };
        }));
      },
      destroy() {
        _element.destroy();
        _component.destroy();
        _element4.destroy();
        _text3.destroy();
        _element5.destroy();
        _text4.destroy();
        _element6.destroy();
        _renderList2.destroy();
        _condition.destroy();
        _condition3.destroy();
        _condition4.destroy();
      }
    };
  });
}