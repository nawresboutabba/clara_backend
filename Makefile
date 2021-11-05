REPORTER = list
MOCHA_OPTS = --ui bdd -c 

test:
	clear
	echo Starting test *********************************************************
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS) test/test.js
	echo Ending test ***********************************************************

solution-create:
	clear
	echo Starting test *********************************************************
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS) test/solution-create.js
	echo Ending test ***********************************************************

middlewares:
	clear
	echo Start Test Server**************************
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS) test/middlewares.js
.PHONY: test
