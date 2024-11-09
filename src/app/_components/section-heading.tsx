type SectionHeadingProps = {
    children: React.ReactNode;
};

export default function SectionHeading({ children }: SectionHeadingProps) {

    return (
        <h1 className="text-2xl md:text-4xl lg:text-4xl text-black dark:text-white font-bold inter-var text-center mt-20">
            {children}
        </h1>
    )
};