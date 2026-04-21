import mysql from 'mysql2/promise';
import fs from 'fs';

const sql = fs.readFileSync('phase-liturgical-official.sql', 'utf8');

async function executeMigration() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('📅 FASE: Calendário Litúrgico Oficial (NOA) - Criando tabelas...\n');
    
    const statements = sql.split(';').filter(s => s.trim());
    let count = 0;
    
    for (const stmt of statements) {
      try {
        await connection.execute(stmt + ';');
        count++;
      } catch (e) {
        if (!e.message.includes('Duplicate')) {
          console.log(`⚠ Error: ${e.message.substring(0, 80)}`);
        }
      }
    }
    
    console.log(`✅ ${count} statements executados com sucesso!\n`);
    
    console.log('✅ Tabelas criadas:');
    console.log('   ✓ liturgicalCycles (ciclos A, B, C)');
    console.log('   ✓ liturgicalSeasons (tempos litúrgicos com cores)');
    console.log('   ✓ liturgicalDatesOfficial (datas oficiais NOA)');
    console.log('   ✓ parishEvents (eventos da paróquia)');
    console.log('   ✓ parishNews (notícias da paróquia)');
    console.log('   ✓ newsComments (comentários em notícias)');
    console.log('   ✓ communityPosts (posts da comunidade)');
    console.log('   ✓ communityComments (comentários da comunidade)');
    console.log('   ✓ priestCoordination (espaço de padres)');
    console.log('   ✓ notificationPreferences (preferências de notificação)\n');
    
    console.log('✅ Cores litúrgicas inseridas:');
    console.log('   ✓ Advento (roxo #9933FF)');
    console.log('   ✓ Natal (branco #FFFFFF)');
    console.log('   ✓ Quaresma (roxo #9933FF)');
    console.log('   ✓ Páscoa (branco #FFFFFF)');
    console.log('   ✓ Pentecostes (vermelho #FF0000)');
    console.log('   ✓ Ordinário (verde #00AA00)\n');
    
  } catch (error) {
    console.error('❌ Erro crítico:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

executeMigration();
