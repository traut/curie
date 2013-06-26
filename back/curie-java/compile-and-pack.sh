echo "Copying the schemas from ../schemas/*.json to src/main/resources/ ..."
cp ../schemas/*.json src/main/resources/
echo "Done"
echo "Compiling and packing"
mvn clean compile test assembly:single
