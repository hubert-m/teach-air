import Loader from "react-loader-spinner";

const LoaderScreen = () => {
    return (
        <div className="loader-screen">
            <div>
                <Loader
                    type="Bars"
                    color="#00BFFF"
                    height="100%"
                    width="100%"
                />
                <h2>Ładowanko...</h2>
            </div>
        </div>
    )
}

export default LoaderScreen;