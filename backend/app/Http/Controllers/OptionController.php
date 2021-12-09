<?php

namespace App\Http\Controllers;

use App\Models\Option;
use Illuminate\Http\Request;

class OptionController extends Controller
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

    public function get_options() {

        if ($this->request->auth->status != 3) {
            return response()->json([
                'error' => 'You arent admin. You cannot get options of web app'
            ], 400);
        }

        $options = Option::all();
        return response()->json($options);
    }
}
