type SectionHeadingProps = {
    children: React.ReactNode;
    visible: boolean;
};

export default function SectionHeading({ children, visible }: SectionHeadingProps) {
    if (!visible) return null;

    return (
        <h1 className="text-2xl md:text-4xl lg:text-4xl text-black dark:text-white font-bold inter-var text-center mt-20">
            {children}
        </h1>
    )
};