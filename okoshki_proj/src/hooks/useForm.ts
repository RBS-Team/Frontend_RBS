import { useState } from "react";

export function useForm<T>(
    initialValues: T,
    validate: (values: T) => Partial<T>
) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState<Partial<T>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (onSubmit: (values: T) => void) => {
        return (e: React.FormEvent) => {
            e.preventDefault();

            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length === 0) {
                onSubmit(values);
            }
        };
    };

    return {
        values,
        errors,
        handleChange,
        handleSubmit,
    };
}