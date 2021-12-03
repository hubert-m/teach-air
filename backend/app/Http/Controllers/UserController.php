<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Course_member;
use App\Models\Sex;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
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

    public function create(Request $request)
    {
        $this->validate($this->request, [
            'email' => 'required|email',
            'password' => 'required',
            'name' => 'required',
            'lastname' => 'required',
            'sex_id' => 'required|numeric'
        ]);

        $user = User::where('email', '=', $request->email)->first();
        if ($user) {
            return response()->json([
                'error' => 'Email is already in use'
            ], 400);
        }

        $sex = Sex::find($request->sex_id);
        if (!$sex) {
            return response()->json([
                'error' => 'Sex does not exist.'
            ], 400);
        }

        try {
            $user = new User;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->name = $request->name;
            $user->second_name = $request->second_name;
            $user->lastname = $request->lastname;
            $user->phone = $request->phone;
            $user->facebook = $request->facebook;
            $user->hobby = $request->hobby;
            $user->description = $request->description;
            $user->sex_id = $request->sex_id;
            $user->activate_token = uniqid();

            $user->save();

            return response()->json([
                'success' => 'User created successfully',
                'user' => $user
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'error' => 'User does not exist.'
            ], 400);
        }

        $sex = Sex::where('id', '=', $user->sex_id)->first();
        $user->sex_id = $sex;

        return response()->json($user);
    }

    /**
     * Authenticate a user and return the token if the provided credentials are correct.
     *
     * @param User $user
     * @return mixed
     */
    public function me()
    {
        $sex = Sex::where('id', '=', $this->request->auth->sex_id)->first();
        $this->request->auth->sex_id = $sex;
        return response()->json($this->request->auth, 200);
    }


    public function sex_list()
    {
        $sex = Sex::all();
        foreach ($sex as $i => $sex_tmp) {
            $countUsers = count(User::where('sex_id', '=', $sex_tmp->id)->get());
            $sex[$i]->count_users = $countUsers;
        }
        return response()->json($sex);
    }

    public function sex_add(Request $request)
    {
        if ($this->request->auth->status !== 3) {
            return response()->json([
                'error' => 'No permissions'
            ], 400);
        }

        $this->validate($this->request, [
            'sex' => 'required',
        ]);

        $sex = Sex::where('value', '=', $this->request->sex)->first();
        if ($sex) {
            return response()->json([
                'error' => 'Sex is already in database'
            ], 400);
        }

        try {
            $sex = new Sex;
            $sex->value = $request->sex;

            $sex->save();

            return response()->json([
                'success' => 'Sex created successfully',
                'sex' => $sex
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete_sex($id)
    {
        if ($this->request->auth->status !== 3) {
            return response()->json([
                'error' => 'No permissions'
            ], 400);
        }

        $sex = Sex::find($id);

        if (!$sex) {
            return response()->json([
                'error' => 'Sex does not exist.'
            ], 400);
        }

        if ($this->request->auth->sex_id == $id) {
            return response()->json([
                'error' => 'You cannot delete your sex'
            ], 400);
        }

        try {
            $sex->delete();

            return response()->json([
                'success' => 'Sex removed successfully',
                'course' => $sex
            ], 202);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function set_status(Request $request, $id)
    {
        if ($this->request->auth->status !== 3) {
            return response()->json([
                'error' => 'No permissions'
            ], 400);
        }

        if ($this->request->auth->id == $id) {
            return response()->json([
                'error' => 'You cannot change status of your account'
            ], 400);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'error' => 'User does not exist.'
            ], 400);
        }

        try {
            $user->status = (int)$request->input('status') ?: $user->status;
            $user->save();

            return response()->json([
                'success' => 'Status changed successfully',
                'user' => $user
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

    }

    public function search(Request $request)
    {
        $id_auth_user = $this->request->auth->id;
        $keyword = $request->input('keyword', '');
        $status = $request->input('status', '');
        $withoutMembersOfCourseId = $request->input('without_members_of_course_id', '');

        if ($withoutMembersOfCourseId != "") {
            $course = Course::where('id', '=', $withoutMembersOfCourseId)->first();
            if (!$course) {
                return response()->json([
                    'error' => 'Course does not exist.'
                ], 400);
            }
        }

        $users = User::
        where(function ($query) use ($id_auth_user, $keyword) {
            if ($keyword != "") {
                $query->where('id', '!=', $id_auth_user);
            }
        })
            ->where(function ($query) use ($keyword) {
                $keywords = explode(" ", $keyword);
                foreach ($keywords as $word) {
                    $word = strtolower($word);
                    $query->whereRaw("LOWER(CONCAT(COALESCE(`name`,''), COALESCE(`second_name`,''), COALESCE(`lastname`,''), COALESCE(`email`,''))) LIKE ?", "%$word%");
                }
            })
            ->where(function ($query) use ($status) {
                if ($status != "") {
                    $query->where('status', '=', $status);
                }
            })
            ->where(function ($query) use ($withoutMembersOfCourseId) {
                if ($withoutMembersOfCourseId != "") {
                    $course = Course::where('id', '=', $withoutMembersOfCourseId)->first();
                    $query->where('id', '!=', $course->created_by);

                    $courseMembers = Course_member::where('course_id', '=', $withoutMembersOfCourseId)->get();
                    foreach ($courseMembers as $member) {
                        $query->where('id', '!=', $member->user_id);
                    }

                    $parent_id = $course->parent_id;
                    while ($parent_id != null) {
                        $course_tmp = Course::where('id', '=', $parent_id)->first();
                        $query->where('id', '!=', $course_tmp->created_by);

                        $courseMembers_tmp = Course_member::where('course_id', '=', $parent_id)->get();
                        foreach ($courseMembers_tmp as $member_tmp) {
                            $query->where('id', '!=', $member_tmp->user_id);
                        }

                        $parent_id = $course_tmp->parent_id;
                    }
                }
            })
            ->get();


        foreach ($users as $i => $user) {
            $sex = Sex::where('id', '=', $user->sex_id)->first();
            $users[$i]->sex_id = $sex;
        }

        return response()->json($users);
    }
}
