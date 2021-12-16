<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Post;
use App\Models\Post_file;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Http\Request;

class ThreadController extends Controller
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

    public function add_thread() {
        $course = Course::where('id', '=', $this->request->course_id)->first();
        if(!$course) {
            return response()->json([
                'error' => 'Kurs nie istnieje'
            ], 400);
        }

        // TODO Zabezpieczyc, sprawdzac czy user jest czlonkiem / adminem kursu i nadrzednych

        try {
            $thread = new Thread();
            $thread->course_id = $this->request->course_id;
            $thread->title = $this->request->title;
            $thread->description = $this->request->description;
            $thread->icon = $this->request->icon;
            $thread->slug = $this->request->slug ?: self::slugify($this->request->title);
            $thread->created_by = $this->request->auth->id;
            $thread->save();

            $post = new Post();
            $post->thread_id = $thread->id;
            $post->content = $this->request->input('content');
            $post->created_by = $this->request->auth->id;
            $post->save();

            $files = $this->request->post("files");

            foreach ($files as $file) {
                try {
                    $filePost = new Post_file;
                    $filePost->post_id = $post->id;
                    $filePost->file_id = $file["id"];
                    $filePost->save();

                } catch (\Throwable $e) {
                    return response()->json([
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            return response()->json([
                'success' => 'Wątek stworzony pomyślnie',
                'thread' => $thread,
                'post' => $post
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function get_threads_list() {
        $course = Course::where('id', '=', $this->request->course_id)->first();
        if(!$course) {
            return response()->json([
                'error' => 'Kurs nie istnieje'
            ], 400);
        }

        // TODO Zabezpieczyc, sprawdzac czy user jest czlonkiem / adminem kursu i nadrzednych

        $threads = Thread::where('course_id', '=', $this->request->course_id)->get();

        foreach($threads as $i => $thread) {
            $author = User::where('id', '=', $thread->created_by)->first();
            $threads[$i]->created_by = $author;
        }

        return response()->json($threads);
    }
}
