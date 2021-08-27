export class D3Component {
  protected _width: number;
  protected _height: number;
  constructor(width: number, height: number,parentEl:HTMLElement) {
    this._width = width;
    this._height = height;
  }

  init(width: number, height: number) {}
  draw() {}
}
