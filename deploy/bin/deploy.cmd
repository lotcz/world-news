set environment=test
if not "%~1"=="" set environment=%1
docker compose run --rm -ti worldnews-deploy ansible-playbook -i inventory.yml playbook.yml -l %environment%
