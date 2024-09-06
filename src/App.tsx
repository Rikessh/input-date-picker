import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import type { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";

type FormValues = {
  phoneNumber: string;
};

export default function App() {
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [country, setCountry] = useState<Country>("US");

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      phoneNumber: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    setSubmitStatus("Form submitted successfully!");
    setTimeout(() => {
      reset();
      setSubmitStatus(null);
    }, 3000);
  };

  const handlePhoneNumberChange = (value: string | undefined) => {
    const maxLength = 15;
    if (value) {
      return value.replace(/\s+/g, "").slice(0, maxLength);
    }
    return value;
  };

  const handleCountryChange = (newCountry: Country | undefined) => {
    if (newCountry) {
      setCountry(newCountry);
      console.log("Country changed to:", newCountry);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-md"
    >
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number:
        </label>
        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: "Phone number is required",
            maxLength: 15,
            validate: (value) => isValidPhoneNumber(value) || "Invalid phone number",
          }}
          render={({ field: { onChange, value, onBlur } }) => (
            <PhoneInput
              id="phoneNumber"
              placeholder="Enter phone number"
              value={value}
              countryCallingCodeEditable={false}
              onChange={(val) => {
                const filteredValue = handlePhoneNumberChange(val);
                onChange(filteredValue);
              }}
              onBlur={onBlur}
              defaultCountry={country}
              international
              onCountryChange={handleCountryChange}
              className="w-full border border-gray-300 rounded hover:shadow-sm placeholder:!text-gray-400 duration-300"
            />
          )}
        />
        {errors.phoneNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
        )}
      </div>
    
      {submitStatus && <p className="text-green-600">{submitStatus}</p>}
    </form>
  );
}
