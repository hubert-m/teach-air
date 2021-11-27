<?php

namespace Database\Factories;

use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     * @throws Exception
     */
    public function definition()
    {
        $male = [
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('12345'),
            'name' => $this->faker->firstNameMale,
            'lastname' => $this->faker->lastName,
            'phone' => $this->faker->phoneNumber,
            'sex_id' => 1,
            'activate_token' => uniqid()
        ];

        $female = [
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('12345'),
            'name' => $this->faker->firstNameFemale,
            'second_name' => $this->faker->firstNameFemale,
            'lastname' => $this->faker->lastName,
            'profile_image' => $this->faker->imageUrl,
            'sex_id' => 2,
            'activate_token' => uniqid()
        ];

        $result = [$male, $female];

        // losowo dodaje kobiety i mężczyzn
        return $result[random_int(0,1)];
    }
}
