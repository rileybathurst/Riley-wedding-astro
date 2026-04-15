declare module "masonry-layout" {
  type MasonryOptions = {
    itemSelector?: string;
    columnWidth?: number | string | Element;
    percentPosition?: boolean;
    [key: string]: unknown;
  };

  export default class Masonry {
    constructor(element: Element | string, options?: MasonryOptions);
    destroy(): void;
    layout(): void;
    reloadItems(): void;
  }
}