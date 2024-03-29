# GAML Prompt Creator

GAML Prompt Creator is a web application that allows the creation of simple question-answer prompts related to GAML programming language (language used by the [GAMA platform](https://gama-platform.org/)). This app is part of a bigger project that aims to create a GAML code generation tool based on an LLM. The release version can be found [here](https://prompt.gama-platform.org). However, for security issues, it's not in public access.  
To contribute to this project by creating some prompts, please email email.example@mail.com

## Installation

- Clone this repo:

```bash
git clone git@github.com:lmartinez2001/GAML-datagen.git
cd GAML-datagen
```

- Fill the `.env.example` file with the required informations, according to your configuration. Then rename it `.env`.

> [!WARNING]
> `DB_HOST_CLIENT` and `DB_HOST_DOCKER` correspond respectively to the host from the user point of view and the host from the Docker container point of view. This distinction is essential in the `DATABASE_URL` field, as some commands such as the database schema migration are executed by the user, whereas the requests sent to the database are performed between two Docker container.

- Build the Docker container:

```bash
docker compose build
```

- Run the Docker container:

```bash
docker compose up
```

After this step, you should have a running container called `gaml-prompt-generator` with three services:

1. gama-server: used to validate the code snippets in prompts
2. gamlgen-1: webapp that allows the user to create prompts
3. postgres-1: database containing all the prompts

You should as well be able to open a tab on `http(s)://host:port` (main view) and `http(s)://host:port/graphql` (apollo server).

- Migrate the database schema using prisma:

```bash
npx prisma migrate dev
```

or

```bash
npx prisma migrate deploy
```

As these two commands suggest, one is more suitable for experimentation purposes, and the other of production purposes. Please refer to [prisma documentation](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production) to get a detailed explanation on the differences between these two commands.

- Start Prisma Studio:

```bash
npx prisma studio
```

This command should start a server on port 5555 and open a new tab in your browser. It allows to see the content of the database

> [!WARNING]
> Make sure that `DATABASE_URL` is using `DB_HOST_CLIENT`

- In your `.env` file, replace the field `${DB_HOST_CLIENT}` by `${DB_HOST_DOCKER}` on the `DATABASE_URL` variable.

## Writing prompts

As these prompts are used to efficiently finetune an LLM, they must follow some strict rules. What's more, there are three different types of expected prompts:

### Text to Text prompts

These prompts are used to bring the general context of the GAMA platform and GAML. They allow the LLM to create some logical and semantic analogies between GAML and other programming languages.  
As illustrated in the below examples, this type of question-answer prompt looks a bit useless, as the main purpose of the model is to generate code. However, these prompts are essential to provide the LLM with a general context. That way it can create analogies between GAML and other programming languages learned by the LLM during its pre-training.

> [!NOTE]
> Answers provided by the LLM can contain pieces of code. However, they will be considered as part of the whole answer text but not as a separate code snippet. (Take a look at the Examples section )

**Examples**

    QUESTION
        What is GAML programming language?

    ANSWER
        GAML is an agent-based language, that provides the possibility to build a model with several paradigms of modeling.

---

    QUESTION
        What is the GAMA Platform?

    ANSWER
        GAMA (GIS Agent-based Modeling Architecture) is a simulation platform with a complete modeling and simulation integrated development environment (IDE) for building spatially explicit agent-based simulations.

---

    QUESTION
        How to declare a new type of agent in GAML?

    ANSWER
        In GAML, a new type of agent is created with the expression `species nameOfSpecies`. Please refer to https://gama-platform.org/wiki/Statements#species for additional information.

---

### Text to Code prompts

The LLM must be fed with plenty of code examples to learn how to combine the different statements, as well as the GAML best coding practices GAML.  
Questions must be either small instructions asking for short code snippets or longer instructions asking to generate more complex models.

> [!IMPORTANT]
> The code snippets provided in the answer section must be valid expressions. In other words, a user should be able to copy and paste the code snippet in GAMA and execute it with no error. For instance, all the variables used in the code snippet must be declared (and initialized if necessary).

**Examples**

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

### Text to Hybrid prompts

These prompts are so-called because they are a mixture of code and text. This type of prompt mainly concerns the conversion of the [GAML documentation](https://gama-platform.org/wiki/Home) into prompts. As most of the types, statements, and built-in features are defined and then followed by an example, the LLM must learn how to switch from code to text and vice-versa.

> [!TIP]
> The easiest to do so is to copy/paste the documentation into prompts

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
            name (an identifier), (omissible): the equation identifier
            params (list): the list of parameters used in predefined equation systems
            simultaneously (list): a list of species containing a system of equations (all systems will be solved simultaneously)
            vars (list): the list of variables used in predefined equation systems

        If the simultaneously: facet is used, a system of all the agents will be solved simultaneously.

---
