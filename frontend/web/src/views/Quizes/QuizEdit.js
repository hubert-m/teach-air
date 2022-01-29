import {useParams} from "react-router";

const QuizEdit = () => {
    let {id} = useParams();

    return (
        <h1>Edycja quizu</h1>
    )
}

export default QuizEdit