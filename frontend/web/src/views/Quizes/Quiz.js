import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import SweetAlert from "react-bootstrap-sweetalert";
import Routes from "../../constants/Routes";
import useWindowSize from "../../helpers/useWindowSize";

let resizePrevent = false;
const Quiz = () => {
    let {id} = useParams();
    const history = useHistory();
    const windowSize = useWindowSize();
    const [ready, setReady] = useState(false);
    const [finish, setFinish] = useState(false);
    const [finishData, setFinishData] = useState({title: '', description: '', type: ''})

    useEffect(() => {
        if (windowSize.width && ready) {
            if (resizePrevent) {
                setFinish(true)
                setFinishData({
                    title: 'Nie wolno oszukiwać :)',
                    description: 'Zmieniłeś rozmiar okna, więc quiz się zakończył. Wynik quizu został wysłany zarówno na Twojego maila jak i do wykładowcy',
                    type: 'danger'
                })
            }
            resizePrevent = true;
        }
    }, [windowSize, ready]);

    const startQuiz = () => {
        setReady(true)
        // pobranie pytania losowego

    }

    return (
        <>
            {ready && (
                <div className="jumbotron" style={{marginTop: '50px'}}>
                    <h1 className="display-7">Quiz id {id} - pytanie losowe</h1>
                    <hr className="my-4"/>
                </div>
            )}
            <SweetAlert
                warning
                showCancel
                show={!ready}
                title="Gotowy na wyzwanie?"
                confirmBtnText="Tak, jedziemy z koksem"
                cancelBtnText="Nie, jeszcze chwila"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => startQuiz()}
                onCancel={() => {
                    history.push(Routes.QUIZZES);
                }}
            >
                Po wystartowaniu nie ma odwrotu, bez względu na wynik zostanie on wysłany do autora kursu
            </SweetAlert>
            <SweetAlert
                variant={finish?.type}
                show={finish}
                title={finishData?.title}
                confirmBtnText="Ok"
                confirmBtnBsStyle="danger"
                onConfirm={() => {
                    history.push(Routes.QUIZZES);
                }}
            >
                {finishData?.description}
            </SweetAlert>
        </>
    )
}

export default Quiz;