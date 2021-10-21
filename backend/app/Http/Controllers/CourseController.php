<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
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

    public function index()
    {
        $courses = Course::all();

        foreach($courses as $i => $course) {
            $count_of_under_course = count(Course::where('parent_id', '=', $courses[$i]->id)->get());
            $courses[$i]->count_of_under_course = $count_of_under_course;
        }


        return response()->json($courses);
    }

    public function create(Request $request)
    {
        $this->validate($this->request, [
            'name' => 'required',
            'parent_id' => 'numeric',
            'created_by' => 'numeric'
        ]);

        try {
            $course = new Course;
            $course->name = $request->name;
            $course->description = $request->description;
            $course->icon = $request->icon;
            $course->slug = $request->slug ?: self::slugify($request->name);
            $course->parent_id = $request->parent_id;
            $course->created_by = $request->created_by ?: $request->auth->id;
            $course->save();

            return response()->json([
                'success' => 'Course created successfully',
                'course' => $course
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $course = Course::find($id);

        if(!$course) {
            return response()->json([
                'error' => 'Course does not exist.'
            ], 404);
        }

        // liczba kursów podrzędnych
        $count_of_under_course = count(Course::where('parent_id', '=', $id)->get());
        $course = (object) array_merge((array) json_decode($course), ['count_of_under_course' => $count_of_under_course]);

        return response()->json($course);
    }

    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if(!$course) {
            return response()->json([
                'error' => 'Course does not exist.'
            ], 404);
        }

        $this->validate($this->request, [
            'parent_id' => 'numeric'
        ]);

        try {
            $course->name = $request->input('name') ?: $course->name;
            $course->description = $request->input('description') ?: $course->description;
            $course->icon = $request->input('icon') ?: $course->icon;
            $course->slug = $request->input('slug') ?: self::slugify($request->input('name')) ?: $course->slug;
            $course->parent_id = $request->input('parent_id') ?: $course->parent_id;
            $course->save();

            return response()->json([
                'success' => 'Course updated successfully',
                'course' => $course
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

    }

    public function destroy($id)
    {
        $course = Course::find($id);

        if(!$course) {
            return response()->json([
                'error' => 'Course does not exist.'
            ], 404);
        }

        try {
            $course->delete();

            return response()->json([
                'success' => 'Course removed successfully',
                'course' => $course
            ], 202);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
