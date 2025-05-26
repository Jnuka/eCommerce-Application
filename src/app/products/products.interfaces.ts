export interface ProductResponse {
  id: string;
  version: number;
  productType: ProductTypeReference;
  masterData: ProductCatalogData;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface ProductCatalogData {
  published: boolean;
  current: ProductData;
  staged: ProductData;
  hasStagedChanges: boolean;
}

export interface ProductTypeReference {
  id: string;
  typeId: string;
}

export interface ProductData {
  name: LocalizedString;
  categories: CategoryReference[];
  description: LocalizedString;
  slug: LocalizedString;
  masterVariant: ProductVariant;
  variants: ProductVariant[];
  searchKeywords: SearchKeywords;
}

export interface CategoryReference {
  id: string;
  // typeId: ReferenceTypeId;
}

export interface LocalizedString {
  'en-US': string;
}

export interface ProductVariant {
  id: string;
  prices: Price[];
  images: Image[];
  attributes: Attribute[];
}
export interface SearchKeywords {
  text: string;
}

export interface Image {
  url: string;
  dimensions: ImageDimensions;
  label: string;
}

export interface ImageDimensions {
  w: number;
  h: number;
}

export interface Price {
  id: string;
  value: TypedMoney;
}

export interface TypedMoney {
  centAmount: number;
  currencyCode: string; // ISO 4217
  type: string;
  fractionDigits: number;
}

export interface Attribute {
  name: string;
  value: AttributePlainEnumValue;
}

export interface AttributePlainEnumValue {
  key: string;
  label: string;
}
