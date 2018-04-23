import enmscripting
import sys
from sys import argv
import time

import logging
logging.basicConfig(filename='/var/tmp/log/downloads.log',level=logging.DEBUG,format='%(asctime)s %(message)s')

enmURL = 'https://enmapache.athtem.eei.ericsson.se'
enm_username = 'Administrator'
enm_password = 'TestPassw0rd'
LOG_STATUS = ''
logs = []
node_name = argv[1] 

def get_node_log_status(node_name):
    global LOG_STATUS
    session = enmscripting.open(enmURL, enm_username, enm_password)
    command = 'netlog status {0}'.format(node_name)
    terminal = session.terminal()
    response = terminal.execute(command)
    for line in response.get_output():
        print(line)
        if 'READY_FOR_DOWNLOAD' in line:
          LOG_STATUS = 'READY_FOR_DOWNLOAD'
          logging.info("Logs ready for download for node {0}".format(node_name))
        else:
            logging.info("Log download status pending for node: {0}".format(node_name)+line)

    enmscripting.close(session)

def get_node_logs():
    ## Uploads all logs from the node and stored in ENM - Use "netlog upload" command to retrieve from ENM ####
    global node_name
    session = enmscripting.open(enmURL, enm_username, enm_password)
    command = 'netlog upload {0}'.format(node_name)
    terminal = session.terminal()
    response = terminal.execute(command)

    for line in response.get_output():
        print(line)
        logging.info(line)
        if "Object not found" in line:
            print 'The Network Element {0} does not exist'.format(node_name)
            exit()

    while (LOG_STATUS != "READY_FOR_DOWNLOAD"):
        print "Checking progress for node logs download....: "+LOG_STATUS
        get_node_log_status(node_name)
        time.sleep(4)
    print "File has completed upload to ENM"
    logging.info("File has completed upload to ENM")

    _download_logs(node_name)

def _download_logs(node_name):
    print "Downlaoding logs from ENM for node: {0}".format(node_name)
    logging.info("Downlaoding logs from ENM for node: {0}".format(node_name))

    session = enmscripting.open(enmURL, enm_username, enm_password)
    terminal = session.terminal()

    command = 'netlog download {0}'.format(node_name)
    result = terminal.execute(command)
    for line in result.get_output():
        print(line)
    if result.has_files():
        for enm_file in result.files():
            filename = 'ERBS_LOGS.zip'
            print('File Name: ' + filename)
            enm_file.download('/tmp/')
    else:
        print('\nFailure for ' + command + '\n')
    enmscripting.close(session)



def describe_node_logs(node_name):
    session = enmscripting.open(enmURL, enm_username, enm_password)
    command = 'netlog describe netsim_LTE08ERBS00001'
    terminal = session.terminal()
    response = terminal.execute(command)
    for line in response.get_output():
        print(line)
        if 'EVENT_LOG' in line:
            print "Found EVENT_LOG!!!"
    enmscripting.close(session)

def clean_up_node_logs(node_name):
    session = enmscripting.open(enmURL, enm_username, enm_password)
    command = 'netlog delete {0}'.format(node_name)
    terminal = session.terminal()
    response = terminal.execute(command)
    for line in response.get_output():
        print(line)

    enmscripting.close(session)

def get_specified_node_log(node_name, logs):
    ## Uploads specified from the node and stored in ENM - Use "netlog upload" command to retrieve from ENM ####
    log_str = ""
    for log in logs:
        log_str + log+";"

    session = enmscripting.open(enmURL, enm_username, enm_password)
    command = 'netlog upload {0}'.format(node_name)
    terminal = session.terminal()
    response = terminal.execute(command)

    for line in response.get_output():
        print(line)
        logging.info(line)

    while (LOG_STATUS != "READY_FOR_DOWNLOAD"):
        print "Checking status for LOG_STATUS: "+LOG_STATUS
        get_node_log_status(node_name)
        time.sleep(4)
    print "File has completed upload to ENM"
    logging.info("File has completed upload to ENM")

    _download_logs(node_name)

def test(logs):
    log_str = ""
    for log in logs:
        log_str += log+";"
    print log_str


get_node_logs()




