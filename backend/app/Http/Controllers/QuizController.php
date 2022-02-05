<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Quiz;
use App\Models\Quiz_question;
use App\Models\User;
use Illuminate\Http\Request;

class QuizController extends Controller
{
    /**
     * The request instance.
     * @var Request
     */
    private $request;

    /**
     * Create a new controller instance.
     * @param Request $request
     * @return void
     */
    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function create_quiz(Request $request) {
        if ($request->auth->status != 3 && $request->auth->status != 2) {
            return response()->json([
                'error' => 'Nie jestes adminem ani wykladowca, wiec nie mozesz tworzyc quizow'
            ], 400);
        }
        if($request->title == "") {
            return response()->json([
                'error' => 'Musisz przekazac wszystkie konieczne wartosci'
            ], 400);
        }


        try {
            $quiz = new Quiz;
            $quiz->title = $request->title;
            $quiz->description = $request->description ?: '';
            $quiz->seconds_for_answer = $request->input('seconds_for_answer', 0) ?: 0;
            $quiz->course_id = $request->input('course_id', 0) ?: 0;
            $quiz->created_by = $request->auth->id;
            $quiz->save();

            return response()->json([
                'success' => 'Quiz stworzony pomyslnie',
                'quiz' => $quiz
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update_quiz($id) {
        $quiz = Quiz::where('id', '=', $id)->first();
        if(!$quiz) {
            return response()->json([
                'error' => 'Taki quiz nie istnieje'
            ], 400);
        }

        if($quiz->created_by != $this->request->auth->id || $this->request->auth->status != 3) {
            return response()->json([
                'error' => 'Nie mozesz edytowac tego quizu'
            ], 400);
        }

        try {
            $quiz->title = $this->request->input('title') ?: $quiz->title;
            $quiz->description = $this->request->input('description') ?: $quiz->description;
            $quiz->seconds_for_answer = $this->request->input('seconds_for_answer') ?: $quiz->seconds_for_answer;
            $quiz->course_id = $this->request->input('course_id') ?: 0;
            $quiz->save();

            return response()->json([
                'success' => 'Quiz zaktualizowany pomyslnie',
                'quiz' => $quiz
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function get_quizzes_list() {
        $quizzes = Quiz::all();
        foreach ($quizzes as $i => $quiz) {
            $user = User::where('id', '=', $quiz->created_by)->first();
            $quizzes[$i]->created_by = $user;

            if($quiz->course_id > 0) {
                $course = Course::where('id', '=', $quiz->course_id)->first();
                $quizzes[$i]->course_id = $course;
            }
        }
        return response()->json($quizzes);
    }

    public function get_quiz($id) {
        $quiz = Quiz::where('id', '=', $id)->first();
        if(!$quiz) {
            return response()->json([
                'error' => 'Taki quiz nie istnieje'
            ], 400);
        }
        $user = User::where('id', '=', $quiz->created_by)->first();
        $quiz->created_by = $user;

        if($quiz->course_id > 0) {
            $course = Course::where('id', '=', $quiz->course_id)->first();
            $quiz->course_id = $course;
        }
        return response()->json($quiz, 200);
    }

    public function create_question(Request $request) {
        if ($request->auth->status != 3 && $request->auth->status != 2) {
            return response()->json([
                'error' => 'Nie jestes adminem ani wykladowca, wiec nie mozesz tworzyc pytan do quizow'
            ], 400);
        }

        $quiz = Quiz::where('id', '=', $request->quiz_id)->first();
        if(!$quiz) {
            return response()->json([
                'error' => 'Taki quiz nie istnieje'
            ], 400);
        }

        if($quiz->created_by != $request->auth->id || $request->auth->status != 3) {
            return response()->json([
                'error' => 'Nie mozesz utworzyc pytania do tego quizu'
            ], 400);
        }

        try {
            $question = new Quiz_question;
            $question->question = $request->question;
            $question->description = $request->description;
            $question->answer_a = $request->answer_a;
            $question->answer_b = $request->answer_b;
            $question->answer_c = $request->answer_c;
            $question->answer_d = $request->answer_d;
            $question->correct_answer = $request->correct_answer;
            $question->quiz_id = $request->quiz_id;
            $question->save();

            return response()->json([
                'success' => 'Pytanie do quizu utworzone pomyslnie',
                'question' => $question
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function random_question($quiz_id) {
        $questions = Quiz_question::where('quiz_id', '=', $quiz_id)->get();
        $count_questions = count($questions);
        if($count_questions == 0) {
            return response()->json([
                'error' => 'Brak pytan'
            ], 400);
        }
        $rand_question = rand(1, $count_questions);
        $array_questions = @json_decode(json_encode($questions), true);
        $question = $array_questions[$rand_question-1];
        return response()->json($question);
    }

    public function get_questions_list($quiz_id) {
        $questions = Quiz_question::where('quiz_id', '=', $quiz_id)->get();
        foreach($questions as $i => $question) {
            $questions[$i]->correct = $question->correct_answer;
        }
        return response()->json($questions);
    }

    public function get_question($id) {
        $question = Quiz_question::where('id', '=', $id)->first();
        return response()->json($question);
    }

    public function check_correct_answer(Request $request) {
        $question = Quiz_question::where('id', '=', $request->question_id)->first();
        if(!$question) {
            return response()->json([
                'error' => 'Nie ma takiego pytania'
            ], 400);
        }
        if($request->answer == "") {
            return response()->json([
                'error' => 'Musisz podac wariant odpowiedzi'
            ], 400);
        }
        if($request->answer != $question->correct_answer) {
            return response()->json([
                'error' => 'Niepoprawna odpowiedz',
                'correct_answer' => $question->correct_answer
            ], 400);
        } else {
            return response()->json([
                'success' => 'Poprawna odpowiedz',
                'question' => $question
            ], 201);
        }
    }

    public function delete_quiz($id) {
        $quiz = Quiz::where('id', '=', $id)->first();
        if(!$quiz) {
            return response()->json([
                'error' => 'Taki quiz nie istnieje'
            ], 400);
        }

        if($quiz->created_by != $this->request->auth->id || $this->request->auth->status != 3) {
            return response()->json([
                'error' => 'Nie mozesz usunac tego quizu'
            ], 400);
        }

        try {
            $quiz->delete();

            return response()->json([
                'success' => 'Quiz usuniety pomyslnie',
                'quiz' => $quiz
            ], 202);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
