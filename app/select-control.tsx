"use client";

import Select, { type SingleValue } from "react-select";

export type SelectOption = { value: string; label: string };

export default function SelectControl({
  options,
  value,
  onChange,
  name,
  placeholder,
  className = "",
  disabled = false,
  instanceId,
}: {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  name?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  instanceId: string;
}) {
  const selected = options.find((option) => option.value === value) ?? null;
  return (
    <>
      {name && <input type="hidden" name={name} value={value} />}
      <Select
        instanceId={instanceId}
        inputId={`${instanceId}-input`}
        className={`app-react-select ${className}`}
        classNamePrefix="app-select"
        options={options}
        value={selected}
        placeholder={placeholder}
        isDisabled={disabled}
        isSearchable={false}
        onChange={(option: SingleValue<SelectOption>) => onChange(option?.value ?? "")}
        noOptionsMessage={() => "No options found"}
      />
    </>
  );
}
