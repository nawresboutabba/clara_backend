REPORTER = list
MOCHA_OPTS = --ui bdd –c

testing:
	clear
	echo Starting test *********************************************************
	./node_modules/mocha/bin/mocha --reporter $(REPORTER) $(MOCHA_OPTS) test/test.js
	echo Ending test ***********************************************************

.PHONY: test
