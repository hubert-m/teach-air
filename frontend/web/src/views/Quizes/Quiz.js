import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router";
import SweetAlert from "react-bootstrap-sweetalert";
import Routes from "../../constants/Routes";
import useWindowSize from "../../helpers/useWindowSize";

const Quiz = () => {
    let {id} = useParams();
    const history = useHistory();
    const windowSize = useWindowSize();
    const [ready, setReady] = useState(false);
    const [finish, setFinish] = useState(false);
    const [showAskFinishQuiz, setShowAskFinishQuiz] = useState(false);
    const [finishData, setFinishData] = useState({title: '', description: '', type: ''})
    const [resizePrevent, setResizePrevent] = useState(false);

    useEffect(() => {
        // wcześniejszy koniec w przypadku zmiany rozmiaru okna
        if (windowSize.width && ready) {
            if (resizePrevent) {
                setFinish(true)
                setFinishData({
                    title: 'Nie wolno oszukiwać :)',
                    description: 'Zmieniłeś rozmiar okna, więc quiz się zakończył. Wynik quizu został wysłany zarówno na Twojego maila jak i do wykładowcy',
                    type: 'danger'
                })
                endQuiz()
            }
            setResizePrevent(true);
        }
    }, [windowSize, ready]);

    // rozpoczecie quizu po zatwierdzeniu komuniktu
    const startQuiz = () => {
        setReady(true)
        // pobranie pytania losowego

    }

    // w przypadku zakonczenia quizu z przicisku i potwierdzenia
    const handleSuccessFinishQuiz = () => {
        endQuiz()
        history.push(Routes.QUIZZES)
        // komunikat z wynikami ewentualnie przekierowanie na strone quizów
    }

    const endQuiz = () => {
        console.log("Strzał do API z wynikami quizu")
        // bez przekierowania
    }

    return (
        <>
            {ready && (
                <>
                    <div className="jumbotron" style={{marginTop: '50px'}}>
                        <h1 className="display-7">Quiz id {id} - pytanie losowe</h1>
                        <hr className="my-4"/>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <p>Wyniki...</p>
                        </div>
                        <div className="col-6">
                            <button type="button" className="btn btn-danger"
                                    onClick={() => setShowAskFinishQuiz(true)}>Zakończ quiz
                            </button>
                        </div>
                    </div>
                </>
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
                warning
                showCancel
                show={showAskFinishQuiz}
                title="Na pewno?"
                confirmBtnText="Tak"
                cancelBtnText="Nie, chcę dalej odpowiadać"
                confirmBtnBsStyle="danger"
                cancelBtnBsStyle="secondary"
                onConfirm={() => {
                    setShowAskFinishQuiz(false)
                    handleSuccessFinishQuiz()
                }}
                onCancel={() => {
                    setShowAskFinishQuiz(false);
                }}
            >
                Czy na pewno chcesz zakończyć quiz? Nie będziesz mógł przystąpić do niego ponownie, a aktualny wynik zostanie zapisany
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