## Aim of GAML Prompt Creator

This tool is used to create a dataset for fine-tuning a language model to generate GAML code. In short, we want the language model to imitate the behavior of a GAML developer, including how to combine statements to create complex models, as well as incorporating best coding practices.

## How to write a prompt

Here are the most important rules to write efficient question/answer pairs:

- Input prompts should be written as if you were addressing someone.
- Make the prompts as clear as possible. The more detailed it is, the more precise the output of the trained model.
- Write the code of the desisered output as you would expect it. In other words, if given an input prompt you are implicitely expecting some statements or code snippets, like the `init` section in a species definition, then write it.

> [!IMPORTANT]
> The code snippets provided in the answer section must be valid expressions. In other words, a user should be able to copy and paste the code snippet in GAMA and execute it with no error. For instance, all the variables used in the code snippet must be declared (and initialized if necessary).

### Examples

    QUESTION
        Code a species called People with the attributes speed of type float, health of type int, and a boolean called is_happy. People can migrate if they are not happy.

    ANSWER
        species People {
            float speed <- 1.0f;
            int health <- 30;
            bool is_happy <- false;

            init {
                // Init section of species People
            }

            // Species People can migrate if not happy
            reflex migrate when: !is_happy {
                // Actions to perform when the reflex is triggered
            }
        }

---

    QUESTION
        How to get the area of geometry?

    ANSWER
        geometry geom <- circle(5);
        float a <- geom.area;

---

## Contribution and Recommandations

To contribute to the creation of the dataset, please send an email to the following address: mail@example.com.

If you have any recommandation to improve the interface or the Instruction section, click on the following [link](link).
