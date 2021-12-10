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
                'error' => 'Nie jestes adminem, nie mozesz pobrac informacji o ustawieniach'
            ], 400);
        }

        $options = Option::all();
        return response()->json($options);
    }

    public function update_options()
    {

        if ($this->request->auth->status != 3) {
            return response()->json([
                'error' => 'Nie jestes adminem, nie mozesz zaktualizowac ustawien'
            ], 400);
        }

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
            'success' => 'Ustawienia zaktualizowane pomyslnie'
        ], 201);
    }

    public function add_option() {
        if ($this->request->auth->status != 3) {
            return response()->json([
                'error' => 'Nie jestes adminem, nie mozesz dodac kolejnej opcji do ustawien'
            ], 400);
        }

        $option = Option::where('option_name', '=', $this->request->option_name)->first();

        if($option) {
            return response()->json([
                'error' => 'Taka opcja juz istnieje w bazie danych'
            ], 400);
        }

        try {
            $option = new Option();
            $option->option_name = $this->request->option_name;
            $option->option_value = $this->request->option_value;
            $option->save();

            return response()->json([
                'success' => 'Opcja dodana pomyslnie'
            ], 201);
        } catch (\Throwable $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
