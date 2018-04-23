import enmscripting
import sys
enmURL = 'https://enmapache.athtem.eei.ericsson.se'
enm_username = 'Administrator'
enm_password = 'TestPassw0rd'
fdn=sys.argv[1]
attribute=sys.argv[2]
def cmedit_cmd():
    session = enmscripting.open(enmURL, enm_username, enm_password)
    command = 'cmedit set '+fdn+' '+attribute
    terminal = session.terminal()
    response = terminal.execute(command)
    for line in response.get_output():
        print(line)

    enmscripting.close(session)

cmedit_cmd()


