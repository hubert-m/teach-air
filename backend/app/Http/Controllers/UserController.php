<?php

namespace App\Http\Controllers;

use App\Mail\MainEmail;
use App\Models\Course;
use App\Models\Course_member;
use App\Models\Message;
use App\Models\Sex;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

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
                'error' => 'Taki email juz istnieje w bazie danych'
            ], 400);
        }

        $sex = Sex::find($request->sex_id);
        if (!$sex) {
            return response()->json([
                'error' => 'Plec nie istnieje'
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

            $data = [
                'type' => 'rejestracja',
                'name' => $user->name.' '.$user->lastname,
                'recipient' => $user->email,
                'activate_token' => $user->activate_token
            ];
            Mail::to($user->email)->send(new MainEmail($data));

            return response()->json([
                'success' => 'Zarejestrowano pomyslnie',
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
                'error' => 'Uzytkownik nie istnieje'
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
        $unread_messages = count(Message::where('recipient_id', '=', $this->request->auth->id)
            ->where('is_read', '=', 0)->get());
        $this->request->auth->unread_messages = $unread_messages;
        return response()->json($this->request->auth, 200);
    }

    public function update_me()
    {
        $me = User::find($this->request->auth->id);

        if (!$me) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        if($this->request->name == "" || $this->request->lastname == "" || $this->request->sex_id == "") {
            return response()->json([
                'error' => 'Nie mozesz usunac wymaganych wartosci'
            ], 400);
        }

        try {
            $me->name = $this->request->name;
            $me->second_name = $this->request->second_name;
            $me->lastname = $this->request->lastname;
            $me->sex_id = intval($this->request->sex_id);
            $me->phone = $this->request->phone;
            $me->facebook = $this->request->facebook;
            $me->description = $this->request->description;
            $me->hobby = $this->request->hobby;
            $me->show_email = intval($this->request->show_email);
            $me->save();

            $sex = Sex::where('id', '=', $me->sex_id)->first();
            $me->sex_id = $sex;
            return response()->json([
                'success' => 'Dane zaktualizowane pomyslnie',
                'auth' => $me
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

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
        if ($this->request->auth->status != 3) {
            return response()->json([
                'error' => 'Brak uprawnien do dodawania plci'
            ], 400);
        }

        $this->validate($this->request, [
            'sex' => 'required',
        ]);

        $sex = Sex::where('value', '=', $this->request->sex)->first();
        if ($sex) {
            return response()->json([
                'error' => 'Taka plec juz istnieje w bazie danych'
            ], 400);
        }

        try {
            $sex = new Sex;
            $sex->value = $request->sex;

            $sex->save();

            return response()->json([
                'success' => 'Plec dodana pomyslnie',
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
        if ($this->request->auth->status != 3) {
            return response()->json([
                'error' => 'Brak uprawnien do usuwania plci'
            ], 400);
        }

        $sex = Sex::find($id);

        if (!$sex) {
            return response()->json([
                'error' => 'Plec nie istnieje'
            ], 400);
        }

        if ($this->request->auth->sex_id == $id) {
            return response()->json([
                'error' => 'Nie mozesz usunac swojej plci'
            ], 400);
        }

        try {
            $sex->delete();

            return response()->json([
                'success' => 'Plec usunieta pomyslnie',
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
        if ($this->request->auth->status != 3) {
            return response()->json([
                'error' => 'Brak uprawnien do zmieniania statusu'
            ], 400);
        }

        if ($this->request->auth->id == $id) {
            return response()->json([
                'error' => 'Nie mozesz zmienic statusu swojego konta'
            ], 400);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        try {
            $user->status = (int)$request->input('status') ?: $user->status;
            $user->save();

            return response()->json([
                'success' => 'Status zmieniony pomyslnie',
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
        $sex_id = $request->input('sex_id', '');
        $withoutMembersOfCourseId = $request->input('without_members_of_course_id', '');

        if ($withoutMembersOfCourseId != "") {
            $course = Course::where('id', '=', $withoutMembersOfCourseId)->first();
            if (!$course) {
                return response()->json([
                    'error' => 'Kurs nie istnieje'
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
            ->where(function ($query) use ($sex_id) {
                if ($sex_id != "") {
                    $query->where('sex_id', '=', $sex_id);
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

    public function set_profile_image()
    {
        $user = User::find($this->request->auth->id);

        if (!$user) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        try {
            $user->profile_image = $this->request->input('profile_image', '');
            $user->save();

            $sex = Sex::where('id', '=', $user->sex_id)->first();
            $user->sex_id = $sex;

            return response()->json([
                'success' => 'Pomyslnie zaktualizowano profilowe',
                'auth' => $user
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

    }

    public function change_password(Request $request) {
        $id_auth_user = $request->auth->id;
        $old_password = $request->old_password;
        $new_password = $request->new_password;

        $user = User::where('id', '=', $id_auth_user)->first();

        if($old_password == "" || $new_password == "") {
            return response()->json([
                'error' => 'Musisz wypelnic wszystkie pola',
            ], 400);
        }

        if (!Hash::check($old_password, $user->password)) {
            return response()->json([
                'error' => 'Stare haslo nie jest prawidlowe',
            ], 400);
        }

        try {
            $user->password = Hash::make($new_password);
            $user->last_change_pass = DB::raw('DATE_ADD(NOW(), INTERVAL 1 HOUR)'); // bez interval 1 hour zwraca godzine wczesniejszy czas
            $user->save();

            return response()->json([
                'success' => 'Pomyslnie zmieniono haslo',
                'auth' => $user
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function send_activation_again(Request $request) {
        $email = $request->email;

        $user = User::where('email', '=', $email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        if($user->status != 0) {
            return response()->json([
                'error' => 'Twoje konto juz jest aktywowane',
            ], 400);
        }

        try {
            $user->activate_token = uniqid();
            $user->save();

        $data = [
            'type' => 'rejestracja',
            'name' => $user->name.' '.$user->lastname,
            'recipient' => $user->email,
            'activate_token' => $user->activate_token
        ];
        Mail::to($user->email)->send(new MainEmail($data));

        return response()->json([
            'success' => 'Link aktywacyjny zostal wyslany na maila',
            'auth' => $user
        ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function activate_account(Request $request) {
        $activate_token = $request->activate_token;
        $user = User::where('activate_token', '=', $activate_token)->first();

        if(!$user) {
            return response()->json([
                'error' => 'Kod aktywacyjny jest nieprawidlowy',
            ], 400);
        }

        if($user->status != 0) {
            return response()->json([
                'error' => 'Twoje konto juz jest aktywowane',
            ], 400);
        }

        try {
            $user->activate_token = uniqid();
            $user->status = 1; // zmieniamy na studenta
            $user->save();

            return response()->json([
                'success' => 'Konto zostalo pomyslnie aktywowane. Juz mozesz sie zalogowac',
                'auth' => $user
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }



    }

    public function send_reset_password(Request $request) {
        $email = $request->email;

        $user = User::where('email', '=', $email)->first();

        if (!$user) {
            return response()->json([
                'error' => 'Uzytkownik nie istnieje'
            ], 400);
        }

        try {
            $user->activate_token = uniqid();
            $user->save();

            $data = [
                'type' => 'resethasla',
                'name' => $user->name.' '.$user->lastname,
                'recipient' => $user->email,
                'activate_token' => $user->activate_token
            ];
            Mail::to($user->email)->send(new MainEmail($data));

            return response()->json([
                'success' => 'Kod do resetu hasla zostal wyslany na maila',
                'auth' => $user
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reset_password(Request $request) {
        $activate_token = $request->activate_token;
        $password = $request->password;
        $user = User::where('activate_token', '=', $activate_token)->first();

        if(!$user) {
            return response()->json([
                'error' => 'Kod do resetu hasla jest nieprawidlowy',
            ], 400);
        }

        try {
            $user->activate_token = uniqid();
            $user->password = Hash::make($password);
            $user->last_change_pass = DB::raw('DATE_ADD(NOW(), INTERVAL 1 HOUR)'); // bez interval 1 hour zwraca godzine wczesniejszy czas
            $user->save();

            return response()->json([
                'success' => 'Haslo zostalo pomyslnie zresetowane. Juz mozesz sie zalogowac',
                'auth' => $user
            ], 201);

        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }

    }
}
