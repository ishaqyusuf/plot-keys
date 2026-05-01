import { NumericFormat, type NumericFormatProps } from "react-number-format";

import { Input } from "./input";

type CurrencyInputProps = Omit<NumericFormatProps, "customInput">;

function CurrencyInput({
  allowNegative = false,
  decimalScale = 0,
  prefix = "₦",
  thousandSeparator = true,
  ...props
}: CurrencyInputProps) {
  return (
    <NumericFormat
      allowNegative={allowNegative}
      customInput={Input}
      decimalScale={decimalScale}
      prefix={prefix}
      thousandSeparator={thousandSeparator}
      {...props}
    />
  );
}

export { CurrencyInput };
