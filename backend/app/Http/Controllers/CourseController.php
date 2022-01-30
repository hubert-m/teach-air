<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Course_member;
use App\Models\Favourite_course;
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
                'error' => 'Kurs nie istnieje'
            ], 400);
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
                'success' => 'Kurs zaktualizowany pomyslnie',
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
                'error' => 'Kurs nie istnieje'
            ], 400);
        }

        try {
            $course->delete();

            return response()->json([
                'success' => 'Kurs usuniety pomyslnie',
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
        $only_favourites = (bool)$this->request->only_favourites;

        if ($only_favourites) {
            $favouritesCoursesId = Favourite_course::where('user_id', '=', $this->request->auth->id)->get();
            if (count($favouritesCoursesId) != 0) {
                $courses = Course::where(function ($query) use ($favouritesCoursesId) {
                    foreach ($favouritesCoursesId as $favouriteCourse) {
                        $query->orWhere('id', '=', $favouriteCourse->course_id);
                    }
                })->get();
            } else {
                $courses = array();
            }
        } else {
            $courses = Course::where('parent_id', '=', $parent_id)->get();
        }

        $isMemberOrAuthorOfParentCourses = false;


        if ($parent_id != null) {
            $currentCourse = Course::where('id', '=', $parent_id)->first();
            if ($currentCourse->created_by == $this->request->auth->id) {
                $isMemberOrAuthorOfParentCourses = true;
            } else {
                $memberOfCurrentCourse = Course_member::where('course_id', '=', $parent_id)->where('user_id', '=', $this->request->auth->id)->first();
                if ($memberOfCurrentCourse) {
                    $isMemberOrAuthorOfParentCourses = true;
                }
            }


            $parent_id = $currentCourse->parent_id;
            while ($parent_id != null) {
                $course_tmp = Course::where('id', '=', $parent_id)->first();

                if (!$isMemberOrAuthorOfParentCourses) {
                    if ($course_tmp->created_by == $this->request->auth->id) {
                        $isMemberOrAuthorOfParentCourses = true;
                    } else {
                        // jeśli jest członkiem któregoś z kursów
                        $course_member_tmp = Course_member::where('course_id', '=', $parent_id)
                            ->where('user_id', '=', $this->request->auth->id)->first();

                        if ($course_member_tmp) {
                            $isMemberOrAuthorOfParentCourses = true;
                        }
                    }
                }

                $parent_id = $course_tmp->parent_id;
            }
        }


        foreach ($courses as $i => $course) {
            if (!$isMemberOrAuthorOfParentCourses) {
                if ($course->created_by == $this->request->auth->id) {
                    $courses[$i]->isMember = 1;
                } else {

                    $member_tmp = Course_member::where('course_id', '=', $course->id)->where('user_id', '=', $this->request->auth->id)->first();
                    if ($member_tmp) {
                        $courses[$i]->isMember = 1;
                    }
                }
            } else {
                $courses[$i]->isMember = 1;
            }

            if ($this->request->auth->status == 3) {
                $courses[$i]->isMember = 1;
            }

            $isFavouriteCourse = Favourite_course::where('course_id', '=', $course->id)->where('user_id', '=', $this->request->auth->id)->first();
            if ($isFavouriteCourse) {
                $courses[$i]->isFavourite = 1;
            } else {
                $courses[$i]->isFavourite = 0;
            }
        }


        return response()->json($courses);
    }

    public function get_course($id)
    {
        $course = Course::where('id', '=', $id)->first();

        if (!$course) {
            return response()->json([
                'error' => 'Kurs nie istnieje'
            ], 400);
        }


        if ($course->created_by == $this->request->auth->id) {
            $course->isMember = 1;
        } else {
            $member_tmp = Course_member::where('course_id', '=', $id)->where('user_id', '=', $this->request->auth->id)->first();
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
                    $course_member_tmp = Course_member::where('course_id', '=', $parent_id)
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

        $isCourseFavourite = Favourite_course::where('course_id', '=', $course->id)
            ->where('user_id', '=', $this->request->auth->id)->first();

        if ($isCourseFavourite) {
            $course->isFavourite = 1;
        } else {
            $course->isFavourite = 0;
        }

        if ($this->request->auth->status == 3) {
            $course->isMember = 1;
        }

        return response()->json($course);
    }

    public function get_members_of_course($id)
    {
        $course = Course::where('id', '=', $id)->first();
        $parent_id = $course->parent_id;

        if (!$course) {
            return response()->json([
                'error' => 'Kurs nie istnieje'
            ], 400);
        }

        $membersId = Course_member::where('course_id', '=', $id)->get();

        // pobieranie wszystkich czlonkow
        $users = User::where('id', '!=', $this->request->auth->id)
        ->where(function ($query) use ($membersId, $parent_id, $course) {
            foreach ($membersId as $member) {
                $query->orWhere('id', '=', $member->user_id);
            }


            $query->orWhere('id', '=', $course->created_by);
            while ($parent_id != null) {
                $course_tmp = Course::where('id', '=', $parent_id)->first();
                $query->orWhere('id', '=', $course_tmp->created_by);

                $membersId_tmp = Course_member::where('course_id', '=', $parent_id)->get();
                foreach ($membersId_tmp as $member_tmp) {
                    $query->orWhere('id', '=', $member_tmp->user_id);
                }

                $parent_id = $course_tmp->parent_id;
            }


        })->get();

        // dopisywanie wartosci do poszczegolnych userow

        foreach ($users as $i => $user) {
            $isMember = Course_member::where('user_id', '=', $user->id)->where('course_id', '=', $course->id)->first();

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
                'error' => 'Nie jestes adminem wiec nie mozesz stworzyc kursu z parent_id = 0'
            ], 400);
        }

        if ($this->request->auth->status != 3 && $this->request->auth->status != 2) {
            return response()->json([
                'error' => 'Brak uprawnien do tworzenia kursow'
            ], 400);
        }

        if ($this->request->auth->status == 2) {
            $membersId = Course_member::where('course_id', '=', $this->request->parent_id)
                ->where('user_id', '=', $this->request->auth->id)->first();
            $author = Course::where('created_by', '=', $this->request->auth->id)
                ->where('id', '=', $this->request->parent_id)->first();
            if (!$membersId && !$author) {
                return response()->json([
                    'error' => 'Jestes nauczycielem, ale nie jestes czlonkiem ani zalozycielem tego kursu wiec nie masz do niego dostepu'
                ], 400);
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
                'success' => 'Kurs stworzony pomyslnie',
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
                'error' => 'Brak uprawnien do dodawania czlonkow do kursu'
            ], 400);
        }

        $course = Course::where('id', '=', $this->request->course_id)->first();

        if (!$course) {
            return response()->json([
                'error' => 'Kurs nie istnieje'
            ], 400);
        }

        $user = User::where('id', '=', $this->request->user_id)->first();

        if (!$user) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        if ($user->status == 3) {
            return response()->json([
                'error' => 'Uzytkownik jest adminem. Nie musisz go dodawac'
            ], 400);
        }

        $course_member = Course_member::where('course_id', '=', $this->request->course_id)
            ->where('user_id', '=', $this->request->user_id)->first();

        if ($course_member) {
            return response()->json([
                'error' => 'Uzytkownik juz jest czlonkiem tego kursu'
            ], 400);
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
                    $course_member_tmp = Course_member::where('course_id', '=', $parent_id)
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
                'error' => 'Uzytkownik juz jest czlonkiem jednego z nadrzednych kursow'
            ], 400);
        }

        try {

            $course_member = new Course_member;
            $course_member->course_id = $this->request->course_id;
            $course_member->user_id = $this->request->user_id;
            $course_member->save();

            return response()->json([
                'success' => 'Czlonek dodany pomyslnie',
                'course_member' => $course_member
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function delete_member()
    {
        if ($this->request->auth->status !== 3 && $this->request->auth->status !== 2) {
            return response()->json([
                'error' => 'Brak uprawnien'
            ], 400);
        }

        $member = Course_member::where('course_id', '=', $this->request->course_id)->where('user_id', '=', $this->request->user_id)->first();

        if (!$member) {
            return response()->json([
                'error' => 'Ten uzytkownik nie jest czlonkiem tego kursu'
            ], 400);
        }

        try {
            $member->delete();

            return response()->json([
                'success' => 'Czlonek usuniety pomyslnie',
                'member' => $member
            ], 202);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function change_favourite_course()
    {
        $course = Course::where('id', '=', $this->request->course_id)->first();

        if (!$course) {
            return response()->json([
                'error' => 'Kurs nie istnieje'
            ], 400);
        }

        $isMemberOfCourse = false;

        $course_member = Course_member::where('course_id', '=', $this->request->course_id)
            ->where('user_id', '=', $this->request->auth->id)->first();

        if ($course_member || $this->request->auth->id == $course->created_by) {
            $isMemberOfCourse = true;
        } else {
            $parent_id = $course->parent_id;
            while ($parent_id != null && !$isMemberOfCourse) {
                $course_tmp = Course::where('id', '=', $parent_id)->first();
                if ($this->request->auth->id == $course_tmp->created_by) {
                    $isMemberOfCourse = true;
                } else {
                    // jeśli jest członkiem któregoś z kursów
                    $course_member_tmp = Course_member::where('course_id', '=', $parent_id)
                        ->where('user_id', '=', $this->request->auth->id)->first();

                    if ($course_member_tmp) {
                        $isMemberOfCourse = true;
                    }
                }
                $parent_id = $course_tmp->parent_id;
            }
        }

        if ($this->request->auth->status == 3) {
            $isMemberOfCourse = true;
        }

        if (!$isMemberOfCourse) {
            return response()->json([
                'error' => 'Nie jestes czlonkiem tego kursu wiec nie mozesz dodac go do ulubionych'
            ], 400);
        }


        $favouriteCourse = Favourite_course::where('course_id', '=', $this->request->course_id)
            ->where('user_id', '=', $this->request->auth->id)->first();

        if ($favouriteCourse) {
            try {
                $favouriteCourse->delete();

                return response()->json([
                    'success' => 'Kurs pomyslnie usuniety z ulubionych',
                    'favourite_course' => $favouriteCourse
                ], 202);
            } catch (\Throwable $e) {
                return response()->json([
                    'error' => $e->getMessage()
                ], 500);
            }
        } else {
            try {
                $favouriteCourse = new Favourite_course();
                $favouriteCourse->course_id = $course->id;
                $favouriteCourse->user_id = $this->request->auth->id;
                $favouriteCourse->save();

                return response()->json([
                    'success' => 'Kurs pomyslnie dodany do ulubionych',
                    'favourite_course' => $favouriteCourse
                ], 201);

            } catch (\Throwable $e) {
                return response()->json([
                    'error' => $e->getMessage()
                ], 500);
            }
        }
    }

    public function get_courses_list_for_select() {
        $courses = Course::all();

        foreach($courses as $i => $course) {
            $prefix_name = "";
            $order_num = 1;
            $parent_id = $course->parent_id;
            while ($parent_id != null) {
                $course_tmp = Course::where('id', '=', $parent_id)->first();
                $prefix_name .= $course_tmp->name." => ";
                $parent_id = $course_tmp->parent_id;
            }
            $courses[$i]->name = $prefix_name.$courses[$i]->name;

        }

        return response()->json($courses);
    }
}
