type Props = {
    width?: number;
    height?: number;
}

const Spinner = ({ width, height }: Props) => {

    return (
        <img src={"/loading.svg"} className="animate-spin spinner" width={width || 24} height={height || 24} alt="" />
    );
};

export default Spinner;
