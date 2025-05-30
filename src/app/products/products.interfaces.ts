export interface ProductResponse {
  id: string;
  version: number;
  productType: ProductTypeReference;
  masterData: ProductCatalogData;
  createdAt: Date;
  lastModifiedAt: Date;
}

export interface ProductProjectionResponse {
  id: string;
  version: number;
  productType: ProductTypeReference;
  name: LocalizedString;
  description: LocalizedString;
  categories: CategoryReference[];
  metaDescription: LocalizedString;
  masterVariant: ProductVariant;
}

export interface TypeResponse {
  id: string;
  version: number;
  name: LocalizedString;
  description: LocalizedString;
  attributes: Attribute[];
}

export interface ProductListResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: ProductProjectionResponse[];
}

export interface TypeListResponse {
  limit: number;
  offset: number;
  count: number;
  total: number;
  results: TypeResponse[];
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
  discounted: DiscountedPrice;
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
  type: {
    values: AttributePlainEnumValue[];
  };
}

export interface AttributePlainEnumValue {
  key: string;
  label: string;
}

export interface DiscountedPrice {
  value: TypedMoney;
  discount: ProductDiscountReference;
}

export interface ProductDiscountReference {
  id: string;
  typeId: string;
}
