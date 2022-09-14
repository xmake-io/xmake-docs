script_path=$(cd $(dirname $0);pwd)
cd  ${script_path}
container_name="xmaker:2.7.1"
if [[ "$1" == "build" ]]
then
    echo "start build docker ${container_name}"
    docker build -f dockerfile.demo --platform linux/x86_64 -t ${container_name} .
    exit 2
fi
mkdir -p /tmp/project
#docker run  --privileged --network host -it -pid=host  --name ${container_name} - /bin/bash 
docker run --privileged --platform linux/x86_64  \
-it --rm \
-v /tmp/project:/home/admin/project \
 ${container_name}  /bin/bash 
