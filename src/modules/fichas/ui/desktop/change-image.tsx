interface ChangeImageProps {
    id: string;
    image: string;
    onChange: (value: string) => void;
}

function ChangeImage({ id, image, onChange }: ChangeImageProps) {
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.select();
    };

    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (!target) return;
        onChange(target.value ?? '');
    };

    return (
        <input
            id={id}
            type="text"
            className="px-1 cursor-pointer w-full text-sm text-popover-foreground bg-popover/80 border border-border rounded-md shadow-sm focus:ring-ring focus:border-ring"
            value={image}
            onFocus={handleFocus}
            onInput={handleInput}
        />
    );
}

export default ChangeImage;