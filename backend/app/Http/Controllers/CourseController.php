<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Courses_member;
use App\Models\User;
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

    public function update(Request $request, $id)
    {
        $course = Course::find($id);

        if (!$course) {
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

        if (!$course) {
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

    public function get_courses_list()
    {
        $parent_id = $this->request->parent_id ?: null;
        $courses = Course::where('parent_id', '=', $parent_id)->get();

        foreach ($courses as $i => $course) {
            if ($course->created_by == $this->request->auth->id) {
                $courses[$i]->isMember = 1;
            } else {

                $member_tmp = Courses_member::where('course_id', '=', $course->id)->where('user_id', '=', $this->request->auth->id)->first();
                if($member_tmp) {
                    $course->isMember = 1;
                } else {
                    $course->isMember = 0;
                }
            }
        }

        return response()->json($courses);
    }

    public function get_course($id)
    {
        $course = Course::where('id', '=', $id)->first();

        if (!$course) {
            return response()->json([
                'error' => 'Course does not exist.'
            ], 404);
        }

        // dopracowac, zwrocic tablice z id i nazwami kursow (tylko do nawigacji)
        if ($course->parent_id > 0) {
            $course->parent_course = $this->get_course($course->parent_id)->original;
        }

        if ($course->created_by == $this->request->auth->id) {
            $course->isMember = 1;
        } else {
            $member_tmp = Courses_member::where('course_id', '=', $id)->where('user_id', '=', $this->request->auth->id)->first();
            if($member_tmp) {
                $course->isMember = 1;
            } else {
                $course->isMember = 0;
            }
        }

        return response()->json($course);
    }

    public function get_members_of_course($id)
    {
        $course = Course::where('id', '=', $id)->first();

        if (!$course) {
            return response()->json([
                'error' => 'Course does not exist.'
            ], 404);
        }

        $membersId = Courses_member::where('course_id', '=', $id)->get();

        if(count($membersId) > 0) {
            $users = User::where(function ($query) use ($membersId) {
                foreach ($membersId as $member) {
                    $query->orWhere('id', '=', $member->user_id);
                }
            })->get();
        } else {
            $users = array();
        }

        foreach ($users as $i => $user) {
            $users[$i]->is_author = 0;
        }

        $user_author = User::where('id', '=', $course->created_by)->first();
        $user_author->is_author = 1;
        array_push($users, $user_author);

        return response()->json($users);
    }

    public function create_course()
    {
        $this->validate($this->request, [
            'name' => 'required'
        ]);

        if($this->request->parent_id == 0) {
            $this->request->parent_id = null;
        }

        if($this->request->parent_id == null && $this->request->auth->status != 3) {
            return response()->json([
                'error' => 'You arent admin. You cannot create course with parent_id = 0'
            ], 404);
        }

        try {
            $course = new Course;
            $course->name = $this->request->name;
            $course->description = $this->request->description;
            $course->icon = $this->request->icon;
            $course->slug = $this->request->slug ?: self::slugify($this->request->name);
            $course->parent_id = $this->request->parent_id;
            $course->created_by = $this->request->auth->id;
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
}
