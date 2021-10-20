<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    public function index()
    {
        $courses = Course::all();
        return response()->json($courses);
    }

    public function create(Request $request)
    {
        $course = new Course;
        $course->name = $request->name;
        $course->description = $request->description;
        $course->icon = $request->icon;
        $course->slug = $request->slug;
        $course->parent_id = $request->parent_id;
        $course->created_by = $request->created_by;

        $course->save();
        return response()->json($course);
    }

    public function show($id)
    {
        $course = Course::find($id);
        return response()->json($course);
    }

    public function update(Request $request, $id)
    {
        $course= Course::find($id);

        $course->name = $request->input('name');
        $course->description = $request->input('description');
        $course->icon = $request->input('icon');
        $course->slug = $request->input('slug');
        $course->parent_id = $request->input('parent_id');
        $course->created_by = $request->input('created_by');

        $course->save();
        return response()->json($course);
    }

    public function destroy($id)
    {
        $course = Course::find($id);
        $course->delete();
        return response()->json('course removed successfully');
    }
}
