# GAML Prompt Creator

GAML Prompt Creator is a web application that allows the creation of simple question-answer prompts related to GAML programming language (language used by [GAMA platform](https://gama-platform.org/)). This app is part of a bigger project that aims to create a GAML code generation tool based on an LLM. The release version can be found [here](https://prompt.gama-platform.org). However, for security issues, it's not in public access.  
To contribute to this project by creating some prompts, please email email.example@mail.com

## Writing prompts

As these prompts are used to efficemtly finetune an LLM, they must follow some strict rules. What's more, there are three different types of expected prompts:

### General prompts

These prompts are used to bring the general context of GAMA platform and GAML. They allow to LLM to create some logical and semantic analogies between GAML and other programming languages.

> [!NOTE]
> As illustrated in below examples, this type of question-answer prompt looks a bit unnatural or even useless, as the input is not really a question, and the expected output sounds like it confirms the input. However these affirmative prompts are essential to feed the LLM with a general context.

**Examples**

    QUESTION
        Your goal is to answer questions and provide code related to GAML programming language. You can output either code snippets or instructions aboute a specific need.

    ANSWER
        I'm an AI being developped to answer questions about GAML programming language. I can generate code snippets or more complex models, or answer general question about GAML or the GAMA Platform.

---

    QUESTION
        What is GAML programming language?

    ANSWER
        GAML is an agent-based language, that provides the possibility to build a model with several paradigms of modeling.

---

    QUESTION
        What is GAMA Platform?

    ANSWER
        GAMA (GIS Agent-based Modeling Architecture) is a simulation platform with a complete modelling and simulation integrated development environment (IDE) for building spatially explicit agent-based simulations.

---

    QUESTION
        How to use the statement "equation"?

    ANSWER
        The equation statement is used to create an equation system from several single equations.
        The basic syntax to define an equation system is:

        float t;
        float S;
        float I;
        equation SI {
            diff(S,t) = (- 0.3 * S * I / 100);
            diff(I,t) = (0.3 * S * I / 100);

}

---

    QUESTION
        In GAML, a type of agents is declared using the keyword "species". This statement uses can contains all the variables (such as integers, floats, references to other species, etc.), reflexes and actions that define the behaviour of the species.

    ANSWER
        species ExampleSpecies {
            int x <- 10;
            int y <- 15;
            float health <- 0.8;

            reflex move {
                health <- health + 0.01;
            }
        }

### Code prompts

The LLM must be fed with plenty of code examples to learn how to combine the different statements with eachother, as well as the best practices specific to GAML.  
Questions must be either small instructions asking for short code snippets or longer instructions asking to generate more complex models.

> [!IMPORTANT]
> This type of prompts includes all the GAMA-platform documentation

**Examples**

    QUESTION
        Code a species called People with the attributes speed of type float, health of type int and a boolean called is_happy. People can migrate if they are not happy.

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

### Documentation prompts

TODO

**Examples**

    QUESTION
        How to use the statement "equation"?

    ANSWER
        The equation statement is used to create an equation system from several single equations.

        The basic syntax to define an equation system is:

        float t;
        float S;
        float I;
        equation SI {
            diff(S,t) = (- 0.3 * S * I / 100);
            diff(I,t) = (0.3 * S * I / 100);
        }

        Facets
            name (an identifier), (omissible) : the equation identifier
            params (list): the list of parameters used in predefined equation systems
            simultaneously (list): a list of species containing a system of equations (all systems will be solved simultaneously)
            vars (list): the list of variables used in predefined equation systems

        If the simultaneously: facet is used, system of all the agents will be solved simultaneously.

---
