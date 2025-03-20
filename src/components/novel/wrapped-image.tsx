// @ts-nocheck
import { Node, mergeAttributes } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { cx } from "class-variance-authority";
import { UploadImagesPlugin } from "novel";

export interface WrappedImageOptions {
  HTMLAttributes: Record<string, any>;
  allowBase64: boolean;
  imageClass?: string;
}

export const WrappedImage = Node.create<WrappedImageOptions>({
  name: "wrappedImage",

  addOptions() {
    return {
      HTMLAttributes: {},
      allowBase64: true,
      imageClass: "",
    };
  },

  group: "block",
  content: "",
  draggable: true,
  isolating: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: null,
      },
      height: {
        default: null,
      },
      alignment: {
        default: "left", // can be 'left', 'right', or 'center'
        parseHTML: (element) => element.getAttribute("data-alignment"),
        renderHTML: (attributes) => {
          if (!attributes.alignment) {
            return {};
          }
          return {
            "data-alignment": attributes.alignment,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[data-wrapped-image] img",
        getAttrs: (node) => {
          const parent = (node as HTMLElement).parentElement;
          return {
            src: (node as HTMLElement).getAttribute("src"),
            alt: (node as HTMLElement).getAttribute("alt"),
            title: (node as HTMLElement).getAttribute("title"),
            width: (node as HTMLElement).getAttribute("width"),
            height: (node as HTMLElement).getAttribute("height"),
            alignment: parent?.getAttribute("data-alignment") || "left",
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { alignment, ...attrs } = HTMLAttributes;

    const wrapperClasses = {
      left: cx("float-left mr-4 mb-2 max-w-md"),
      right: cx("float-right ml-4 mb-2 max-w-md"),
      center: cx("mx-auto block mb-4"),
    };

    return [
      "div",
      {
        "data-wrapped-image": "",
        "data-alignment": alignment,
        class: wrapperClasses[alignment as keyof typeof wrapperClasses],
      },
      ["img", mergeAttributes(this.options.HTMLAttributes, attrs)],
    ];
  },

  addCommands() {
    return {
      setWrappedImage:
        (options) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: options,
            })
            .run();
        },
      updateWrappedImageAlignment:
        (alignment) =>
        ({ state, dispatch }) => {
          const { selection } = state;
          const node = selection.$anchor.node();

          if (node && node.type === this.type) {
            if (dispatch) {
              dispatch(
                state.tr.setNodeMarkup(selection.$anchor.pos, undefined, {
                  ...node.attrs,
                  alignment,
                }),
              );
              return true;
            }
          }

          return false;
        },
    } as Partial<RawCommands>;
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("wrappedImagePlugin"),
      }),
      UploadImagesPlugin({
        imageClass: this.options.imageClass || "",
      }),
    ];
  },
});
