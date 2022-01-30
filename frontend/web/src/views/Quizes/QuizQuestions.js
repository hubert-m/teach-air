import {useParams} from "react-router";

const QuizQuestions = () => {
    let {id} = useParams();

    return (
        <h1>Lista pytań quizu id = {id}</h1>
    )
}

export default QuizQuestions