if [ -z "$1" ]
  then
    echo "Supply a version number. E.g. bash createRelease.sh 0.0.1"
    exit 1
fi

sudo docker build -t gerovanmi/dnd-website -t gerovanmi/dnd-website:$1 .
sudo docker push gerovanmi/dnd-website:latest 
sudo docker push gerovanmi/dnd-website:$1
