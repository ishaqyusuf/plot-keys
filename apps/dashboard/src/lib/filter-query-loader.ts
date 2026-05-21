export type SearchParamsInput = Record<string, string | string[] | undefined>;

export type QueryParamParser<T> = {
  parse: (value: string | null) => T | null;
  serialize: (value: T) => string;
};

export type QueryParamSchema = Record<string, QueryParamParser<any>>;

export type InferQueryParamSchema<TSchema extends QueryParamSchema> = {
  [Key in keyof TSchema]: ReturnType<TSchema[Key]["parse"]>;
};

export type SetQueryFilters<TSchema extends QueryParamSchema> = (
  next: Partial<InferQueryParamSchema<TSchema>> | null,
) => void;

export const parseAsString = {
  parse: (value: string | null) => {
    if (value === null || value.trim() === "") {
      return null;
    }

    return value;
  },
  serialize: (value: string) => value,
} satisfies QueryParamParser<string>;

export function loadQueryParams<TSchema extends QueryParamSchema>(
  schema: TSchema,
  input: SearchParamsInput,
): InferQueryParamSchema<TSchema> {
  return Object.fromEntries(
    Object.entries(schema).map(([key, parser]) => {
      const rawValue = input[key];
      const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

      return [key, parser.parse(value ?? null)];
    }),
  ) as InferQueryParamSchema<TSchema>;
}
