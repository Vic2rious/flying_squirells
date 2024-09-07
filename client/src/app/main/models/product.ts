
export interface Product {
  id: number;
  name: string;
  short_description: string;
  description: string;
  discount: number;
  mark_as_new: boolean;
  price: number;
  quantity: number;
  cover_photo: string;
  sizes:Array<string>;
  colors:Array<string>;
  additional_photos:Array<string>;
}
