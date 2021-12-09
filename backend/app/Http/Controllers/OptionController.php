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

    public function get_options()
    {

        if ($this->request->auth->status != 3) {
            return response()->json([
                'error' => 'You arent admin. You cannot get options of web app'
            ], 400);
        }

        $options = Option::all();
        return response()->json($options);
    }

    public function update_options()
    {
        $options = $this->request->input();

        foreach ($options as $option_name => $option_value) {
            $option = Option::where('option_name', '=', $option_name)->first();
            if ($option) {
                try {
                    $option->option_value = $option_value;
                    $option->save();
                } catch (\Throwable $e) {
                    return response()->json([
                        'error' => $e->getMessage()
                    ], 500);
                }
            }
        }

        return response()->json([
            'success' => 'Options updated successfully'
        ], 201);
    }
}
