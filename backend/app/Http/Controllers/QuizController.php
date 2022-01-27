<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Quiz;
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
            $quiz->description = $request->description;
            $quiz->seconds_for_answer = $request->input('seconds_for_answer', 0) ?: 0;
            $quiz->course_id = $request->input('course_id', 0);
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
}
