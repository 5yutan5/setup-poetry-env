# setup-poetry-env

This action allows setting up Python and Poetry, installing dependencies,
and caching dependencies and Poetry installation all at once.
You can simplify the troublesome poetry setup.
Also this action wraps around
[actions/setup-python](https://github.com/actions/setup-python).

## Features

- Setup Python and Poetry
- Cache Python dependencies and Poetry installation
- Auto install Python dependencies
- Generate different caches of python dependencies depending on the arguments (--only, --with and etc) you enter in the `poetry install` command.

## Usage

### Basic usage

```yml
    steps:
      - uses: actions/checkout@v3
      - name: Setup Poetry env
        uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: 3.x
```

Also you can check all inputs and outputs.

### Set up a specific Poetry version

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-version: '1.2.0'
```

### Disable to install dependency

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-install-dependencies: 'false'
```

### Disable to cache dependencies

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          cache-dependencies: 'false'
```

### Use wrapper around `poetry config` commands

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-virtualenvs-in-project: 'true'
```

### Use wrapper around `poetry install` commands

This step will install only some libraries.
Optimize each install by creating a different cache than just `poetry install`.

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-install--only-root: 'true'
```

### Use wrapper around `poetry install` additional command

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-install-additional-args: '-vvv'
```

## Action Inputs

All inputs are optional. If not set, sensible defaults will be used.

| Name | Description | Default |
| --- | --- | --- |
| `cache-dependencies` | Whether to cache installed dependencies. | `true` |
| `poetry-version` | The Poetry version to install. | `latest version` |
| `poetry-install-dependencies` | Whether Poetry should install dependencies after completing all setup. | `true` |

### Wrapper around `actions/setup-python` inputs

You can use some `actions/setup-python` inputs.
For more information about these inputs, see the [actions/setup-python](https://github.com/actions/setup-python).

| Name | Description |
| --- | --- |
| `token` | Wrapper around `token` input. |
| `python-architecture` | Wrapper around `architecture` input. |
| `python-cache-dependency-path` | Wrapper around `cache-dependency-path` input. |
| `python-check-latest` | Wrapper around `check-latest` input. |
| `python-update-environment` | Wrapper around `update-environment` input. |
| `python-version` | Wrapper around `version` input. |
| `python-version-file` | Wrapper around `version-file` input. |

### Wrapper around `poetry config` commands

You can access `poetry config` commands.
For more information about `poetry config` command, see the [Poetry Configuration](https://python-poetry.org/docs/configuration/).

| Name | Description |
| --- | --- |
| `poetry-cache-dir` | Wrapper around setting `cache-dir`. |
| `poetry-installer-max-workers` | Wrapper around setting `cache-dir`. |
| `poetry-installer-parallel` | Wrapper around setting `installer.parallel`. |
| `poetry-pypi-token` | Wrapper around setting `pypi-token`. |
| `poetry-virtualenvs-create` | Wrapper around setting `virtualenvs.create`. |
| `poetry-virtualenvs-in-project` | Wrapper around setting `virtualenvs.in-project`. |
| `poetry-virtualenvs-path` | Wrapper around setting `virtualenvs-path`. |

### Wrapper around `poetry install` commands

You can access `poetry install` commands.
For more information about `poetry install` command, see the [Poetry Commands/install](https://python-poetry.org/docs/cli/#install).

| Name | Description | Type |
| --- | --- | --- |
| `poetry-install-additional-args` | Arguments passed directly to the `poetry install` command. | `string` |
| `poetry-install--all-extras` | Whether use `--all-extras` option. | `boolean string` |
| `poetry-install--extras` | Wrapper around argument of `poetry install --extras`. | `string` |
| `poetry-install--no-root` | Whether use `--no-root` option to `poetry install`. | `boolean string` |
| `poetry-install--only` | Wrapper around argument of `poetry install --only`. | `string` |
| `poetry-install--only-root` | Whether use `--only-root` option to `poetry install`. | `boolean string` |
| `poetry-install--with` | Wrapper around argument of `poetry install --with`. | `string` |
| `poetry-install--with` | Wrapper around argument of `poetry install --with`. | `string` |
| `poetry-install--without` | Wrapper around argument of `poetry install --without`. | `string` |

## Action Outputs

| Name | Description | Type |
| --- | --- | --- |
| `poetry-cache-hit` | A boolean value to indicate a cache entry of poetry installation was found | boolean |
| `cache-hit` | Wrapper around `cache-hit` output of actions/setup-python. | boolean |
| `python-path` | Wrapper around `python-path` output of actions/setup-python. | string |
| `python-version` | Wrapper around `python-version` output of actions/setup-python. | string |
