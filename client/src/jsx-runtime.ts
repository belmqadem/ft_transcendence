declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export const jsx = {
  component(
    component: string | ((props: any) => HTMLElement),
    props: any,
    ...children: any[]
  ) {
    if (!props) props = {};
    props.children = children.flat();

    if (typeof component === "function") return component(props);

    const el = document.createElement(component);
    for (const [key, val] of Object.entries(props)) {
      if (key === "children") continue;
      if (key === "className") el.setAttribute("class", String(val));
      else el.setAttribute(key, String(val));
    }

    props.children.forEach((child: any) =>
      el.append(child instanceof Node ? child : document.createTextNode(child))
    );

    return el;
  },
};
