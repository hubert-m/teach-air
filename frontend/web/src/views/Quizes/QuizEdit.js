import {useHistory, useParams} from "react-router";
import {StatusUser} from "../../constants/StatusUser";
import Routes from "../../constants/Routes";
import {useEffect} from "react";

const QuizEdit = ({ userData }) => {
    let {id} = useParams();
    const history = useHistory();

    useEffect(() => {
        if(userData?.status != StatusUser.ADMIN && userData?.status != StatusUser.TEACHER) {
            history.push(Routes.QUIZZES);
        }
    },[])

    return (
        <>
            <h1>Formularz edycji quizu = {id}</h1>
            <h1>Lista pytań quizu id = {id}</h1>
            <h1>Lista uzytkownikow ktorzy rozwiazali quiz + mozliwosc dania kolejnej szansy</h1>
        </>
    )
}

export default QuizEdit