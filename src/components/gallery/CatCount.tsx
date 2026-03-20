export default function CatCount({ count }: { count: number }) {
    return (
        <div
            className="font-handwriting text-theme text-2xl mx-auto w-fit mb-6"
        >
            Totaal aantal foto's: {count}
        </div>
    );
}
