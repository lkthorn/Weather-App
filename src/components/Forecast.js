export const weatherForecast = ({ min, max, description }) => {
    return(

        <div>
            <div>Description: {description}</div>
            <div>Temperature: {min} / {max}</div>
        </div>
    );
};

