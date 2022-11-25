# setup-poetry-env

This action allows to setup Python/Poetry, installing dependencies,
and caching dependencies and Poetry installation all at once.
You can simplify the troublesome poetry setup.
Also this action wraps around
[actions/setup-python](https://github.com/actions/setup-python).

## Features

- Setup Python and Poetry
- Cache Python dependencies and Poetry installation
- Install Python dependencies
- Cache only specific groups, if you use [Poetry Dependency groups](https://python-poetry.org/docs/managing-dependencies/)

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

### Set up a specific Poetry version

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-version: '1.2.0'
```

### Use wrapper around `poetry config` commands

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-virtualenvs-in-project: 'true'
```

### Use wrapper around `poetry install` commands

`poetry-install--only: 'docs'` is the same as `poetry install --only docs`.

```yml
      - uses: 5yutan5/setup-poetry-env@v1
        with:
          python-version: '3.x'
          poetry-install--only: 'docs'
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
| `additional-dependency-cache-key` | Additional dependency cache key. | `string` |
| `poetry-version` | The Poetry version to install. | `latest version` |
| `poetry-install-dependencies` | Whether Poetry should install dependencies after completing all setup. | `true` |

### Wrapper around `actions/setup-python` inputs

This action uses `actions/setup-python` internally.
You can use some inputs of it.
For more information about these inputs, see the [actions/setup-python](https://github.com/actions/setup-python).

| Name | Description |
| --- | --- |
| `token` | Wrapper around `token`. |
| `python-architecture` | Wrapper around `architecture`. |
| `python-cache-dependency-path` | Wrapper around `cache-dependency-path`. |
| `python-check-latest` | Wrapper around `check-latest`. |
| `python-update-environment` | Wrapper around `update-environment`. |
| `python-version` | Wrapper around `version`. |
| `python-version-file` | Wrapper around `version-file`. |

### Wrapper around `poetry config` commands

You can set settings of `poetry config`.
For more information about `poetry config` command, see the [Poetry Configuration](https://python-poetry.org/docs/configuration/).

| Name | Description |
| --- | --- |
| `poetry-cache-dir` | Wrapper around `cache-dir`. |
| `poetry-installer-max-workers` | Wrapper around `installer-max-workers`. |
| `poetry-installer-parallel` | Wrapper around `installer.parallel`. |
| `poetry-pypi-token` | Wrapper around `pypi-token`. |
| `poetry-virtualenvs-create` | Wrapper around `virtualenvs.create`. |
| `poetry-virtualenvs-in-project` | Wrapper around `virtualenvs.in-project`. |
| `poetry-virtualenvs-path` | Wrapper around `virtualenvs-path`. |

### Wrapper around `poetry install` commands

You can use some options of `poetry install` commands.
For more information about `poetry install` command, see the [Poetry Commands/install](https://python-poetry.org/docs/cli/#install).

| Name | Description | Type |
| --- | --- | --- |
| `poetry-install-additional-args` | Arguments passed directly to the `poetry install` command. | `string` |
| `poetry-install--all-extras` | Whether to use `--all-extras` option. | `boolean string` |
| `poetry-install--extras` | Wrapper around argument of `poetry install --extras`. | `string` |
| `poetry-install--no-root` | Whether to use `--no-root` option to `poetry install`. | `boolean string` |
| `poetry-install--only` | Wrapper around argument of `poetry install --only`. | `string` |
| `poetry-install--only-root` | Whether to use `--only-root` option to `poetry install`. | `boolean string` |
| `poetry-install--with` | Wrapper around argument of `poetry install --with`. | `string` |
| `poetry-install--with` | Wrapper around argument of `poetry install --with`. | `string` |
| `poetry-install--without` | Wrapper around argument of `poetry install --without`. | `string` |

## Action Outputs

| Name | Description | Type |
| --- | --- | --- |
| `poetry-cache-hit` | A boolean value to indicate a cache entry of poetry installation was found | `boolean` |
| `cache-hit` | Wrapper around `cache-hit` output of actions/setup-python. | `boolean` |
| `python-path` | Wrapper around `python-path` output of actions/setup-python. | `string` |
| `python-version` | Wrapper around `python-version` output of actions/setup-python. | `string` |
