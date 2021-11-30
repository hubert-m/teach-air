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
                if ($member_tmp) {
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


        if ($course->created_by == $this->request->auth->id) {
            $course->isMember = 1;
        } else {
            $member_tmp = Courses_member::where('course_id', '=', $id)->where('user_id', '=', $this->request->auth->id)->first();
            if ($member_tmp) {
                $course->isMember = 1;
            } else {
                $course->isMember = 0;
            }
        }

        $navigation = array();

        $order_num = 1;
        $parent_id = $course->parent_id;
        while ($parent_id != null) {
            $course_tmp = Course::where('id', '=', $parent_id)->first();

            // dziedziczenie uprawnień z kursów nadrzędnych (jeśli user okaże się któregoś członkiem to zwróci 1
            if ($course->isMember == 0) {
                if ($course_tmp->created_by == $this->request->auth->id) {
                    // jeśli jest autorem ktróegoś z kursów
                    $course->isMember = 1;
                } else {
                    // jeśli jest członkiem któregoś z kursów
                    $course_member_tmp = Courses_member::where('course_id', '=', $parent_id)
                        ->where('user_id', '=', $this->request->auth->id)->first();

                    if ($course_member_tmp) {
                        $course->isMember = 1;
                    }
                }
            }

            $array_to_push = [
                "id" => $course_tmp->id,
                "name" => $course_tmp->name,
                "order" => $order_num
            ];
            $order_num++;
            array_push($navigation, $array_to_push);
            $parent_id = $course_tmp->parent_id;
        }

        $course->navi = $navigation;

        return response()->json($course);
    }

    public function get_members_of_course($id)
    {
        $course = Course::where('id', '=', $id)->first();
        $parent_id = $course->parent_id;

        if (!$course) {
            return response()->json([
                'error' => 'Course does not exist.'
            ], 404);
        }

        $membersId = Courses_member::where('course_id', '=', $id)->get();

        // pobieranie wszystkich czlonkow
        $users = User::where(function ($query) use ($membersId) {
            foreach ($membersId as $member) {
                $query->orWhere('id', '=', $member->user_id);
            }
        })
            ->orWhere('id', '=', $course->created_by)
            ->orWhere(function ($query) use ($parent_id) {
                while ($parent_id != null) {
                    $course_tmp = Course::where('id', '=', $parent_id)->first();
                    $query->orWhere('id', '=', $course_tmp->created_by);

                    $membersId_tmp = Courses_member::where('course_id', '=', $parent_id)->get();
                    foreach ($membersId_tmp as $member_tmp) {
                        $query->orWhere('id', '=', $member_tmp->user_id);
                    }

                    $parent_id = $course_tmp->parent_id;
                }
            })
            ->get();

        // dopisywanie wartosci do poszczegolnych userow

        foreach ($users as $i => $user) {
            $isMember = Courses_member::where('user_id', '=', $user->id)->where('course_id', '=', $course->id)->first();

            if (!$isMember) {
                if ($user->id == $course->created_by) {
                    $users[$i]->is_author = 1;
                } else {
                    $users[$i]->is_author_or_member_of_one_of_parent = 1;
                }
            }
        }

        return response()->json($users);
    }

    public function create_course()
    {
        $this->validate($this->request, [
            'name' => 'required'
        ]);

        if ($this->request->parent_id == 0) {
            $this->request->parent_id = null;
        }

        if ($this->request->parent_id == null && $this->request->auth->status != 3) {
            return response()->json([
                'error' => 'You arent admin. You cannot create course with parent_id = 0'
            ], 404);
        }

        if ($this->request->auth->status != 3 && $this->request->auth->status != 2) {
            return response()->json([
                'error' => 'You cannot create course. No permision'
            ], 404);
        }

        if ($this->request->auth->status == 2) {
            $membersId = Courses_member::where('course_id', '=', $this->request->parent_id)
                ->where('user_id', '=', $this->request->auth->id)->first();
            if (!$membersId) {
                return response()->json([
                    'error' => 'You are a teacher, but you arent a member of this course so you dont have access to this course'
                ], 404);
            }
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

    public function add_member()
    {
        if ($this->request->auth->status != 3 && $this->request->auth->status != 2) {
            return response()->json([
                'error' => 'You cannot add members to courses. No permision'
            ], 404);
        }

        $course = Course::where('id', '=', $this->request->course_id)->first();

        if (!$course) {
            return response()->json([
                'error' => 'Course does not exist.'
            ], 404);
        }

        $user = User::where('id', '=', $this->request->user_id)->first();

        if (!$user) {
            return response()->json([
                'error' => 'User does not exist.'
            ], 404);
        }

        if ($user->status == 3) {
            return response()->json([
                'error' => 'User is admin. You dont need to add him'
            ], 404);
        }

        $course_member = Courses_member::where('course_id', '=', $this->request->course_id)
            ->where('user_id', '=', $this->request->user_id)->first();

        if ($course_member) {
            return response()->json([
                'error' => 'User is already member of this course.'
            ], 404);
        }


        $isMemberOrAuthorOfParentCourses = false;

        $parent_id = $course->parent_id;
        while ($parent_id != null) {
            $course_tmp = Course::where('id', '=', $parent_id)->first();

            if (!$isMemberOrAuthorOfParentCourses) {
                if ($course_tmp->created_by == $this->request->user_id) {
                    $isMemberOrAuthorOfParentCourses = true;
                } else {
                    // jeśli jest członkiem któregoś z kursów
                    $course_member_tmp = Courses_member::where('course_id', '=', $parent_id)
                        ->where('user_id', '=', $this->request->user_id)->first();

                    if ($course_member_tmp) {
                        $isMemberOrAuthorOfParentCourses = true;
                    }
                }
            }

            $parent_id = $course_tmp->parent_id;
        }

        if ($isMemberOrAuthorOfParentCourses) {
            return response()->json([
                'error' => 'User is already member of one of parent courses.'
            ], 404);
        }

        try {

            $courses_member = new Courses_member;
            $courses_member->course_id = $this->request->course_id;
            $courses_member->user_id = $this->request->user_id;
            $courses_member->save();

            return response()->json([
                'success' => 'Member created successfully',
                'courses_member' => $courses_member
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
